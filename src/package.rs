//! A reusable program's description — the same one whether it is installed
//! as a shared gene or attached at runtime as a plasmid.
//!
//! A gene's `.gene.json` always said what its bytes hash to and which
//! version they are. Schema 1 keeps those fields where they were and adds
//! what a caller needs before it decides to use the program: a stable `id`,
//! a `title` and a `purpose`, the names it expects its application to
//! provide (`bindings`), the particles it answers (`handlers`) and how it is
//! meant to be started (`triggers`).
//!
//! ```json
//! {
//!   "schema": 1,
//!   "id": "euglena/outbox",
//!   "name": "outbox",
//!   "title": "Outbox",
//!   "purpose": "Tells the reader whether a change was saved.",
//!   "version": "0.9.0",
//!   "asset": "outbox.gene.code",
//!   "sha256": "<64 hex>",
//!   "bindings": { "required": ["store"], "dynamic": [] },
//!   "handlers": [{ "class": "OutboxPost", "fields": ["item"] }],
//!   "triggers": [{ "kind": "manual" }]
//! }
//! ```
//!
//! **Identity.** `id` names the package and never changes — not with a new
//! version, a new `title`, or a rename of a saved copy. `name` is the
//! registry/file name; `title` is for people. A description without `schema`
//! is legacy (every `.gene.json` published before 0.9.0): it is read as it
//! always was, and its `id` is `euglena/<name>` — derived from the one fact
//! it has, so the same on every read and every install.
//!
//! **Bindings** are what the source emits to that it does not link itself:
//! names the enclosing application must provide (ticket 153's `Offer`). They
//! are requirements, not permissions — the application decides what it
//! offers. They are read from the parsed source (`code handlers`' `emits`),
//! never guessed from text. `dynamic` lists names that hold an address at
//! runtime rather than naming an organelle; they are not required. A
//! description with no `bindings` never declared them: that is unknown, not
//! "none".
//!
//! **Triggers** are declarations — `manual`, `event { class }`, `timer { at |
//! every, once? }`. Reading one installs nothing, subscribes to nothing and
//! does not mean the application can deliver it.
//!
//! **Package versus saved instance.** A package is shareable. Who saved a
//! copy, from which conversation, its memory links and whether it is loaded
//! belong to that copy — an *instance* record that holds a package, never
//! the other way round. A description carrying any of those fields is
//! refused, so they cannot travel with it by mistake. See [`export`].

use serde_json::{json, Map, Value};

/// The newest schema this euglena reads.
pub const SCHEMA: u64 = 1;

/// Fields that belong to one owner's saved copy, never to a package.
const INSTANCE_FIELDS: &[&str] = &[
    "instance",
    "owner",
    "creator",
    "conversations",
    "conversation",
    "memory",
    "loaded",
    "active",
    "enabled",
    "access",
    "state",
];

const TRIGGER_KINDS: &[&str] = &["manual", "event", "timer"];

/// A description, read and checked. `raw` is kept whole so fields this
/// euglena does not know survive a round trip.
#[derive(Debug, Clone)]
pub struct Description {
    pub schema: u64,
    pub id: String,
    pub name: String,
    pub version: Option<String>,
    pub sha256: String,
    /// `None`: never declared.
    pub bindings: Option<Bindings>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Bindings {
    pub required: Vec<String>,
    pub dynamic: Vec<String>,
}

/// Read a description. Refuses, with the reason, anything malformed, a
/// schema newer than this euglena, a bad digest, an instance field.
pub fn parse(value: &Value) -> Result<Description, String> {
    let object = value
        .as_object()
        .ok_or("a package description must be a JSON object")?;
    let schema = match object.get("schema") {
        None => 0,
        Some(v) => match v.as_u64() {
            Some(n) if n <= SCHEMA => n,
            Some(n) => {
                return Err(format!(
                    "package description schema {n} is newer than this euglena reads \
                     (up to {SCHEMA}) — upgrade euglena"
                ))
            }
            None => return Err("'schema' must be a whole number".to_string()),
        },
    };
    let name = text(object, "name")?.ok_or("a package description names no 'name'")?;
    if !name
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
    {
        return Err(format!(
            "'name' {name:?} may hold only letters, digits, '-' and '_'"
        ));
    }
    let sha256 = text(object, "sha256")?.ok_or(format!("'{name}' names no sha256"))?;
    if sha256.len() != 64
        || !sha256
            .chars()
            .all(|c| c.is_ascii_digit() || ('a'..='f').contains(&c))
    {
        return Err(format!(
            "'{name}' has a sha256 that is not 64 lowercase hex digits"
        ));
    }
    let version = text(object, "version")?;
    if schema == 0 {
        return Ok(Description {
            schema,
            id: format!("euglena/{name}"),
            name,
            version,
            sha256,
            bindings: None,
        });
    }

    if let Some(field) = INSTANCE_FIELDS.iter().find(|f| object.contains_key(**f)) {
        return Err(format!(
            "'{field}' belongs to a saved copy of '{name}', not to its package description"
        ));
    }
    let id = text(object, "id")?.ok_or(format!("'{name}' names no 'id'"))?;
    if id.is_empty() || id.chars().any(char::is_whitespace) {
        return Err(format!(
            "'{name}' has an 'id' that is empty or holds spaces"
        ));
    }
    if version.is_none() {
        return Err(format!("'{name}' names no 'version'"));
    }
    text(object, "title")?;
    text(object, "purpose")?;
    let bindings = match object.get("bindings") {
        None => None,
        Some(Value::Object(b)) => Some(Bindings {
            required: names(b.get("required"), "bindings.required")?,
            dynamic: names(b.get("dynamic"), "bindings.dynamic")?,
        }),
        Some(_) => return Err("'bindings' must be an object".to_string()),
    };
    if let Some(handlers) = object.get("handlers") {
        let list = handlers.as_array().ok_or("'handlers' must be a list")?;
        for h in list {
            if h.get("class").and_then(Value::as_str).is_none() {
                return Err("every entry of 'handlers' needs a 'class'".to_string());
            }
        }
    }
    if let Some(triggers) = object.get("triggers") {
        let list = triggers.as_array().ok_or("'triggers' must be a list")?;
        for t in list {
            trigger(t)?;
        }
    }
    Ok(Description {
        schema,
        id,
        name,
        version,
        sha256,
        bindings,
    })
}

fn text(object: &Map<String, Value>, key: &str) -> Result<Option<String>, String> {
    match object.get(key) {
        None => Ok(None),
        Some(Value::String(s)) => Ok(Some(s.clone())),
        Some(_) => Err(format!("'{key}' must be a string")),
    }
}

fn names(value: Option<&Value>, what: &str) -> Result<Vec<String>, String> {
    let Some(value) = value else {
        return Ok(Vec::new());
    };
    let list = value
        .as_array()
        .ok_or(format!("'{what}' must be a list of names"))?;
    let mut out = Vec::new();
    for v in list {
        out.push(
            v.as_str()
                .ok_or(format!("'{what}' must be a list of names"))?
                .to_string(),
        );
    }
    out.sort();
    out.dedup();
    Ok(out)
}

fn trigger(t: &Value) -> Result<(), String> {
    let kind = t
        .get("kind")
        .and_then(Value::as_str)
        .ok_or("every trigger needs a 'kind'")?;
    if !TRIGGER_KINDS.contains(&kind) {
        return Err(format!(
            "trigger kind '{kind}' is not one this euglena knows ({})",
            TRIGGER_KINDS.join(", ")
        ));
    }
    if kind == "event" && t.get("class").and_then(Value::as_str).is_none() {
        return Err("an 'event' trigger names the particle 'class' it is started by".to_string());
    }
    if kind == "timer" && t.get("at").or_else(|| t.get("every")).is_none() {
        return Err("a 'timer' trigger says 'at' or 'every'".to_string());
    }
    Ok(())
}

/// What the parsed source says about itself, from `code handlers`.
#[derive(Debug, Clone, Default)]
pub struct Derived {
    /// Every name an emit reaches.
    pub emits: Option<Vec<String>>,
    /// Aliases the source links itself.
    pub linked: Vec<String>,
    /// `{ class, fields }` for each handler.
    pub handlers: Vec<Value>,
}

impl Derived {
    /// Read `code handlers` output. `emits` is `None` from a `code` older
    /// than 2.26.0, which does not report it.
    pub fn from_catalog(catalog: &Value) -> Derived {
        let emits = catalog.get("emits").and_then(Value::as_array).map(|list| {
            list.iter()
                .filter_map(Value::as_str)
                .map(str::to_string)
                .collect()
        });
        let linked = catalog
            .get("modules")
            .and_then(Value::as_array)
            .map(|list| {
                list.iter()
                    .filter(|m| m.get("kind").and_then(Value::as_str) == Some("native"))
                    .filter_map(|m| m.get("name").and_then(Value::as_str))
                    .map(str::to_string)
                    .collect()
            })
            .unwrap_or_default();
        let handlers = catalog
            .get("handlers")
            .and_then(Value::as_array)
            .map(|list| {
                list.iter()
                    .filter_map(|h| {
                        let class = h.get("name")?.as_str()?;
                        let fields: Vec<Value> = h
                            .get("fields")
                            .and_then(Value::as_array)
                            .map(|fs| {
                                fs.iter()
                                    .filter_map(|f| f.get("wire_name").cloned())
                                    .collect()
                            })
                            .unwrap_or_default();
                        Some(json!({ "class": class, "fields": fields }))
                    })
                    .collect()
            })
            .unwrap_or_default();
        Derived {
            emits,
            linked,
            handlers,
        }
    }

    /// The names the application must provide: emitted to, not linked here,
    /// and not one the author marked dynamic. `None` when unknown.
    pub fn required(&self, dynamic: &[String]) -> Option<Vec<String>> {
        let emits = self.emits.as_ref()?;
        let mut out: Vec<String> = emits
            .iter()
            .filter(|n| !self.linked.contains(n) && !dynamic.contains(n))
            .cloned()
            .collect();
        out.sort();
        Some(out)
    }
}

/// Build a schema-1 description of `source`, from what the source says
/// (`derived`), its bytes, and what only its author knows (`meta`: `id`,
/// `title`, `purpose`, `triggers`, `bindings.dynamic`).
pub fn describe(
    name: &str,
    version: &str,
    source: &[u8],
    derived: &Derived,
    meta: &Value,
) -> Result<Value, String> {
    let mut out = Map::new();
    out.insert("schema".into(), json!(SCHEMA));
    let id = meta
        .get("id")
        .and_then(Value::as_str)
        .map(str::to_string)
        .unwrap_or_else(|| format!("euglena/{name}"));
    out.insert("id".into(), json!(id));
    out.insert("name".into(), json!(name));
    for key in ["title", "purpose"] {
        if let Some(v) = meta.get(key) {
            out.insert(key.into(), v.clone());
        }
    }
    out.insert("version".into(), json!(version));
    out.insert("asset".into(), json!(format!("{name}.gene.code")));
    out.insert("sha256".into(), json!(crate::sha256::hex(source)));
    let dynamic = names(
        meta.get("bindings").and_then(|b| b.get("dynamic")),
        "bindings.dynamic",
    )?;
    if let Some(required) = derived.required(&dynamic) {
        out.insert(
            "bindings".into(),
            json!({ "required": required, "dynamic": dynamic }),
        );
    }
    out.insert("handlers".into(), Value::Array(derived.handlers.clone()));
    if let Some(triggers) = meta.get("triggers") {
        out.insert("triggers".into(), triggers.clone());
    }
    let value = Value::Object(out);
    parse(&value)?;
    Ok(value)
}

/// What a check found. `errors` make the description unusable with this
/// source; `notes` are worth knowing and change nothing.
#[derive(Debug, Default)]
pub struct Report {
    pub errors: Vec<String>,
    pub notes: Vec<String>,
}

/// Does this description describe these bytes? The digest must match; the
/// declared bindings must agree with what the source emits to, where that
/// can be read.
pub fn check(desc: &Description, source: &[u8], derived: Option<&Derived>) -> Report {
    let mut report = Report::default();
    let found = crate::sha256::hex(source);
    if found != desc.sha256 {
        report.errors.push(format!(
            "the source does not match the description's sha256 (described {}, found {found}) \
             — describe it again for a new version rather than editing the digest",
            desc.sha256
        ));
    }
    if desc.schema == 0 {
        report.notes.push(format!(
            "a legacy description (no 'schema'): its id is {}, from its name",
            desc.id
        ));
    }
    let Some(declared) = &desc.bindings else {
        report
            .notes
            .push("binding requirements were never declared".to_string());
        return report;
    };
    let Some(derived) = derived else {
        return report;
    };
    let Some(actual) = derived.required(&declared.dynamic) else {
        report.notes.push(
            "this `code` does not report what a source emits to (2.26.0 does): \
             bindings not compared"
                .to_string(),
        );
        return report;
    };
    for name in &actual {
        if !declared.required.contains(name) {
            report.errors.push(format!(
                "the source emits to '{name}', which the description does not require \
                 — add it to bindings.required, or to bindings.dynamic if it holds an address"
            ));
        }
    }
    for name in &declared.required {
        if !actual.contains(name) {
            report.notes.push(format!(
                "the description requires '{name}', which the source never emits to"
            ));
        }
    }
    report
}

/// A package from one owner's saved copy, fit to give to someone else: the
/// description and the source, nothing of the copy. `instance` is a record
/// `{ instance, owner, name, package, source, ... }`; everything but
/// `package` and `source` stays behind — the copy's own name included, since
/// the receiver names their copy themselves.
///
/// The reference for every place that keeps saved copies (Mike's saved
/// plasmids keep theirs in its own store, in Code): tested here, called
/// there.
#[cfg_attr(not(test), allow(dead_code))]
pub fn export(instance: &Value) -> Result<Value, String> {
    let package = instance
        .get("package")
        .ok_or("a saved copy holds its package under 'package'")?;
    let desc = parse(package)?;
    let source = instance
        .get("source")
        .and_then(Value::as_str)
        .ok_or("a saved copy holds its source under 'source'")?;
    let report = check(&desc, source.as_bytes(), None);
    if let Some(error) = report.errors.first() {
        return Err(error.clone());
    }
    Ok(json!({ "package": package, "source": source }))
}

/// Ask `code handlers` what `source` says about itself.
fn derive(source: &std::path::Path) -> Result<Derived, String> {
    let code = crate::exec::baseline_code_binary_or_exit();
    let out = std::process::Command::new(&code)
        .arg("handlers")
        .arg(source)
        .output()
        .map_err(|e| format!("cannot run '{code}': {e}"))?;
    if !out.status.success() {
        return Err(format!(
            "`code handlers` refused {}: {}",
            source.display(),
            String::from_utf8_lossy(&out.stderr).trim()
        ));
    }
    let catalog: Value = serde_json::from_slice(&out.stdout)
        .map_err(|e| format!("`code handlers` printed something that is not JSON: {e}"))?;
    Ok(Derived::from_catalog(&catalog))
}

fn read_json(path: &str) -> Result<Value, String> {
    let text = std::fs::read_to_string(path).map_err(|e| format!("cannot read {path}: {e}"))?;
    serde_json::from_str(&text).map_err(|e| format!("{path} is not JSON: {e}"))
}

/// `euglena describe <source>`: print the description of a `.gene.code`
/// (or any `.code` meant to be reused), or, with `--check`, say whether a
/// description describes it.
pub fn run(source: &str, meta: Option<&str>, version: Option<&str>, check_path: Option<&str>) {
    if let Err(e) = describe_cli(source, meta, version, check_path) {
        eprintln!("euglena: {e}");
        std::process::exit(1);
    }
}

fn describe_cli(
    source: &str,
    meta: Option<&str>,
    version: Option<&str>,
    check_path: Option<&str>,
) -> Result<(), String> {
    let path = std::path::Path::new(source);
    let bytes = std::fs::read(path).map_err(|e| format!("cannot read {source}: {e}"))?;
    let derived = derive(path)?;
    if let Some(check_path) = check_path {
        let desc = parse(&read_json(check_path)?).map_err(|e| format!("{check_path}: {e}"))?;
        let report = check(&desc, &bytes, Some(&derived));
        for note in &report.notes {
            println!("note: {note}");
        }
        for error in &report.errors {
            eprintln!("error: {error}");
        }
        if !report.errors.is_empty() {
            return Err(format!("{check_path} does not describe {source}"));
        }
        println!("{check_path} describes {source} ({})", desc.id);
        return Ok(());
    }
    let name = path
        .file_name()
        .and_then(|n| n.to_str())
        .map(|n| n.trim_end_matches(".code").trim_end_matches(".gene"))
        .ok_or_else(|| format!("{source} has no file name"))?;
    let meta = match meta {
        Some(m) => read_json(m)?,
        None => json!({}),
    };
    let version = version
        .map(str::to_string)
        .or_else(|| {
            meta.get("version")
                .and_then(Value::as_str)
                .map(str::to_string)
        })
        .unwrap_or_else(|| env!("CARGO_PKG_VERSION").to_string());
    let value = describe(name, &version, &bytes, &derived, &meta)?;
    println!(
        "{}",
        serde_json::to_string_pretty(&value).map_err(|e| e.to_string())?
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    const SOURCE: &str = "Remind { text } =>\n    emit Notify { message = text } to push get sent\n    return sent\n";

    fn derived() -> Derived {
        Derived::from_catalog(&json!({
            "schema_version": 1,
            "handlers": [{ "name": "Remind", "fields": [{ "wire_name": "text" }] }],
            "modules": [],
            "emits": ["push"]
        }))
    }

    fn described() -> Value {
        describe(
            "reminder",
            "1.0.0",
            SOURCE.as_bytes(),
            &derived(),
            &json!({ "id": "mike/reminder", "title": "Reminder", "triggers": [{ "kind": "timer", "at": "17:00", "once": true }] }),
        )
        .unwrap()
    }

    #[test]
    fn a_description_says_what_the_source_needs_and_answers() {
        let d = described();
        assert_eq!(d["schema"], 1);
        assert_eq!(d["id"], "mike/reminder");
        assert_eq!(d["bindings"]["required"], json!(["push"]));
        assert_eq!(d["handlers"][0]["class"], "Remind");
        assert_eq!(d["handlers"][0]["fields"], json!(["text"]));
        assert_eq!(d["sha256"], crate::sha256::hex(SOURCE.as_bytes()));
        let parsed = parse(&d).unwrap();
        assert!(check(&parsed, SOURCE.as_bytes(), Some(&derived()))
            .errors
            .is_empty());
    }

    #[test]
    fn legacy_descriptions_read_as_they_always_did() {
        let legacy = json!({ "name": "palette", "version": "0.8.0", "asset": "palette.gene.code", "sha256": "a".repeat(64) });
        let one = parse(&legacy).unwrap();
        let two = parse(&legacy).unwrap();
        assert_eq!(one.schema, 0);
        assert_eq!(one.id, "euglena/palette");
        assert_eq!(one.id, two.id);
        assert!(
            one.bindings.is_none(),
            "never declared is unknown, not none"
        );
        let notes = check(&one, b"x", None);
        assert!(notes.errors[0].contains("does not match"));
        assert!(notes.notes[0].contains("legacy"));
        assert!(notes.notes[1].contains("never declared"));
    }

    #[test]
    fn renaming_and_new_versions_keep_the_identity() {
        let first = described();
        let changed = SOURCE.replace("sent", "delivered");
        let second = describe(
            "reminder",
            "1.1.0",
            changed.as_bytes(),
            &derived(),
            &json!({ "id": "mike/reminder", "title": "Evening reminder" }),
        )
        .unwrap();
        assert_eq!(first["id"], second["id"]);
        assert_ne!(first["sha256"], second["sha256"]);
        // The old description does not describe the new bytes.
        let old = parse(&first).unwrap();
        assert!(!check(&old, changed.as_bytes(), None).errors.is_empty());
    }

    #[test]
    fn source_and_description_must_agree_on_bindings() {
        let mut d = described();
        d["bindings"]["required"] = json!(["store"]);
        let parsed = parse(&d).unwrap();
        let report = check(&parsed, SOURCE.as_bytes(), Some(&derived()));
        assert!(report.errors[0].contains("emits to 'push'"));
        assert!(report.notes[0].contains("requires 'store'"));
        // A name the author says holds an address is not required.
        d["bindings"] = json!({ "required": [], "dynamic": ["push"] });
        let parsed = parse(&d).unwrap();
        let report = check(&parsed, SOURCE.as_bytes(), Some(&derived()));
        assert!(report.errors.is_empty(), "{:?}", report.errors);
        // An older code that cannot say: noted, not failed.
        let blind = Derived {
            emits: None,
            ..derived()
        };
        let report = check(&parsed, SOURCE.as_bytes(), Some(&blind));
        assert!(report.errors.is_empty());
        assert!(report.notes[0].contains("not compared"));
    }

    #[test]
    fn triggers_round_trip_and_are_only_read() {
        let d = described();
        let again: Value = serde_json::from_str(&serde_json::to_string(&d).unwrap()).unwrap();
        assert_eq!(d, again);
        assert_eq!(d["triggers"][0]["at"], "17:00");
        let mut bad = d.clone();
        bad["triggers"] = json!([{ "kind": "webhook" }]);
        assert!(parse(&bad).unwrap_err().contains("webhook"));
        bad["triggers"] = json!([{ "kind": "event" }]);
        assert!(parse(&bad).unwrap_err().contains("class"));
    }

    #[test]
    fn refusals_name_what_is_wrong() {
        let mut d = described();
        d["schema"] = json!(2);
        assert!(parse(&d).unwrap_err().contains("upgrade euglena"));
        let mut d = described();
        d["sha256"] = json!("nothex");
        assert!(parse(&d).unwrap_err().contains("64 lowercase hex"));
        let mut d = described();
        d["owner"] = json!("someone");
        assert!(parse(&d).unwrap_err().contains("saved copy"));
        assert!(parse(&json!([1])).is_err());
        assert!(parse(
            &json!({ "schema": 1, "name": "x", "sha256": "a".repeat(64), "version": "1" })
        )
        .unwrap_err()
        .contains("'id'"));
    }

    #[test]
    fn exporting_a_saved_copy_leaves_the_owner_behind() {
        let mine = json!({
            "instance": "copy-of-owner-a",
            "owner": "owner-a",
            "name": "my evening reminder",
            "conversations": ["c-17"],
            "memory": ["m-3"],
            "loaded": { "id": 4, "version": 2, "hash": "sha256:..." },
            "package": described(),
            "source": SOURCE
        });
        let shared = export(&mine).unwrap();
        let text = serde_json::to_string(&shared).unwrap();
        for private in [
            "owner-a",
            "c-17",
            "m-3",
            "copy-of-owner-a",
            "my evening reminder",
        ] {
            assert!(!text.contains(private), "{private} travelled: {text}");
        }
        assert_eq!(shared["package"]["id"], "mike/reminder");
        // Someone else's copy of it: their own instance, the same package.
        let theirs = json!({ "instance": "b9", "owner": "owner-b", "name": "reminder", "package": shared["package"], "source": shared["source"] });
        assert_eq!(
            parse(&theirs["package"]).unwrap().id,
            parse(&mine["package"]).unwrap().id
        );
        let mut tampered = mine.clone();
        tampered["source"] = json!("Other {} =>\n    return Done {}\n");
        assert!(export(&tampered).unwrap_err().contains("does not match"));
    }
}

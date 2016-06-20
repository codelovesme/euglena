/**
 * Created by codelovesme on 6/19/2015.
 */

///<reference path="..\typings\mocha\mocha.d.ts"/>
///<reference path="..\typings\chai\chai.d.ts"/>

import {euglena} from "../src/index";
import * as chai from "chai";

import Class = euglena.js.Class;

describe("euglena", () => {
    describe("js", () => {
        describe("Class", () => {
            describe("doesCover", () => {
                it("should return false if obj1 is empty obj2 has some keys", () => {
                    //given
                    let obj1 = {};
                    let obj2 = { name: "fedai" };
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.false;
                });
                it("should return true if obj1 is and obj2 same object", () => {
                    //given
                    let obj1 = { name: "fedai" };
                    let obj2 = { name: "fedai" };
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.true;
                });
                it("should return true if obj1 is and obj2 same object and has inner object", () => {
                    //given
                    let obj1 = { name: { surname: "kaya" } };
                    let obj2 = { name: { surname: "kaya" } };
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.true;
                });
                it("should return true if obj1 is and obj2 different object and has inner object", () => {
                    //given
                    let obj1 = { name: { surname: "fedai" } };
                    let obj2 = { name: { surname: "kaya" } };
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.false;
                });
                it("should return true if obj2 is empty", () => {
                    //given
                    let obj1 = { name: { surname: "fedai" } };
                    let obj2 = {};
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.true;
                });
                it("should return false if obj2 has dıfferent keys", () => {
                    //given
                    let obj1 = { name: { surname: "fedai" } };
                    let obj2 = { surname: "fedai" };
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.false;
                });
                it("should return true if both of them is empty objects", () => {
                    //given
                    let obj1 = {   };
                    let obj2 = { };
                    //when
                    let result = Class.doesCover(obj1, obj2);
                    //then
                    chai.expect(result).to.be.true;
                });
            });
            describe("extend", () => {
                it("should return empty object if subInstance and parentInstance are both empty objects", () => {
                    //given
                    var subInstance = {};
                    var parentInstance = {};
                    //when
                    var extendedObject = euglena.js.Class.extend(subInstance, parentInstance);
                    //then
                    chai.expect(extendedObject).to.be.empty;
                });

                it("should return an object contains prop name for empty object as subInstance and an object has a property named 'name' as parentInstance", () => {
                    //given
                    var subInstance = {};
                    var parentInstance = { name: "fedai" };
                    //when
                    var extendedObject = euglena.js.Class.extend(subInstance, parentInstance);
                    var propCount = Object.keys(extendedObject).length;
                    //then
                    chai.expect(extendedObject).not.to.be.eqls(null);
                    chai.expect(extendedObject).not.to.be.eqls({});
                    chai.expect(extendedObject).not.to.be.eqls({ name: "" });
                    chai.expect(extendedObject).to.be.eqls({ name: "fedai" });
                    chai.expect(propCount).to.be.equals(1);
                });

                it("should return an object contains prop name and surname for an object has prop surname as subInstance and an object has a property named 'name' as parentInstance", () => {
                    //given
                    var subInstance = { surname: "kaya" };
                    var parentInstance = { name: "fedai" };
                    //when
                    var extendedObject = euglena.js.Class.extend(subInstance, parentInstance);
                    var propCount = Object.keys(extendedObject).length;
                    //then
                    chai.expect(extendedObject).to.be.eqls({ name: "fedai", surname: "kaya" });
                    chai.expect(propCount).to.be.equals(2);
                });
            });
        });
    });
    describe("being", () => {
        describe("alive", () => {
            describe("alive", () => {

            });
        });
    });
});

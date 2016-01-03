/**
 * Created by codelovesme on 6/19/2015.
 */
///<reference path="..\typings\mocha\mocha.d.ts"/>
///<reference path="..\typings\chai\chai.d.ts"/>
///<reference path="../src/cessnalib.ts"/>
var cessnalib_1 = require("../src/cessnalib");
var chai = require("chai");
describe("cessnalib", function () {
    describe("js", function () {
        describe("Class", function () {
            describe("extend", function () {
                it("should return empty object if subInstance and parentInstance are both empty objects", function () {
                    //given
                    var subInstance = {};
                    var parentInstance = {};
                    //when
                    var extendedObject = cessnalib_1.cessnalib.js.Class.extend(subInstance, parentInstance);
                    //then
                    chai.expect(extendedObject).to.be.empty;
                });
                it("should return an object contains prop name for empty object as subInstance and an object has a property named 'name' as parentInstance", function () {
                    //given
                    var subInstance = {};
                    var parentInstance = { name: "fedai" };
                    //when
                    var extendedObject = cessnalib_1.cessnalib.js.Class.extend(subInstance, parentInstance);
                    var propCount = Object.keys(extendedObject).length;
                    //then
                    chai.expect(extendedObject).not.to.be.eqls(null);
                    chai.expect(extendedObject).not.to.be.eqls({});
                    chai.expect(extendedObject).not.to.be.eqls({ name: "" });
                    chai.expect(extendedObject).to.be.eqls({ name: "fedai" });
                    chai.expect(propCount).to.be.equals(1);
                });
                it("should return an object contains prop name and surname for an object has prop surname as subInstance and an object has a property named 'name' as parentInstance", function () {
                    //given
                    var subInstance = { surname: "kaya" };
                    var parentInstance = { name: "fedai" };
                    //when
                    var extendedObject = cessnalib_1.cessnalib.js.Class.extend(subInstance, parentInstance);
                    var propCount = Object.keys(extendedObject).length;
                    //then
                    chai.expect(extendedObject).to.be.eqls({ name: "fedai", surname: "kaya" });
                    chai.expect(propCount).to.be.equals(2);
                });
            });
        });
    });
    describe("being", function () {
        describe("alive", function () {
            describe("alive", function () {
            });
        });
    });
});
//# sourceMappingURL=index.js.map
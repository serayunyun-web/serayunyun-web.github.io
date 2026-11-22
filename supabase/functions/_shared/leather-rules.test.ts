import assert from "node:assert/strict";
import test from "node:test";
import { isDigitalFoilLeather, leatherCode, leatherFoilConflict, wantsDigitalFoil } from "./leather-rules.ts";

test("只有皮紋系列 C／D 色號可以數位燙金", () => {
  assert.equal(leatherCode("皮紋系列（C10）"), "C10");
  assert.ok(isDigitalFoilLeather("皮紋系列（D91）"));
  assert.ok(!isDigitalFoilLeather("翡翠系列（J10）"));
  assert.ok(!isDigitalFoilLeather("單色系列（施工本專用皮）"));
  assert.ok(!isDigitalFoilLeather("其他（布面、紙面或自備材料，請在下方說明）"));
});

test("數位燙金搭配只能傳統燙金的皮革才算衝突", () => {
  assert.ok(wantsDigitalFoil({ thesisFoil: "數位燙金（免製版）" }));
  assert.ok(!wantsDigitalFoil({ thesisFoil: "製版燙金（全版）" }));
  assert.ok(leatherFoilConflict({ contractFoil: "數位燙金" }, "絲光系列（B10）"));
  assert.ok(!leatherFoilConflict({ contractFoil: "數位燙金" }, "皮紋系列（C10）"));
  assert.ok(!leatherFoilConflict({ contractFoil: "製版燙金" }, "絲光系列（B10）"));
  assert.ok(!leatherFoilConflict({ contractFoil: "數位燙金" }, "其他（布面、紙面或自備材料，請在下方說明）"));
  assert.ok(!leatherFoilConflict({ contractFoil: "數位燙金" }, undefined));
});

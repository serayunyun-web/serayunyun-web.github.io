# 產品圖 Gemini 生圖提示詞

17 項產品 × 3 張（01 正面全貌／02 裝訂細節／03 翻開內頁）。

## 使用方式

1. **每次對話先上傳兩張圖**：
   - 公司商標圖（唯一可以出現的品牌標誌）。
   - 風格參考圖（米白封面、淡藍綠有機色塊、小鳥商標的那張書冊照片）。
2. 貼上下面的「共用開頭」，再貼該產品的 01。滿意後，**在同一個對話裡**接著貼 02、03，並補一句：「同一本書，保持封面材質、顏色與商標位置完全一致」。
3. 存檔：`public/images/products/{產品代號}-01.webp`、`-02.webp`、`-03.webp`，橫式 3:2，建議 2400×1600。
4. 每張生完都檢查：商標有沒有變形、有沒有冒出亂碼文字或其他品牌、裝訂方式對不對、封面顏色有沒有跑掉。

規則重點：

- 所有產品都是**直式 A4（210 × 297 mm）**。圖片本身是橫式 3:2，書放在中間。
- **一定用皮革**：論文、工程施工本、工程合約書，顏色直接指定皮革樣本編號。
- **其他 14 項**不一定用皮革，改用紙、布或卡紙封面。封面的材質、顏色、商標做法刻意錯開，避免每本封面都長一樣。
- **背景全部統一**：米白無縫攝影棚背景，不放任何道具，整排產品圖看起來一致，差異只在封面。
- 顏色都取自 VI 色票：素白／米白 `#FAF8F1`、鴻萊藍綠 `#207A75`、深森綠 `#293E38`、暖木棕 `#926A46`、燙金 `#D4AF37`，以及它們的淺色延伸。
- 封面可以有插畫，但只能是 VI 風格的元素：手繪小鳥線稿、虛線飛行軌跡、柔和的水波或有機色塊。**不能有任何文字**，品牌只能用商標。

提示詞用英文寫，生圖效果通常比較穩定；每段上面有中文說明方便核對。

## 共用開頭（每次對話先貼一次）

```
You are generating product photos for a Taiwanese bookbinding studio's website.

Attachments: (1) the company logo — the ONLY branding allowed; reproduce it exactly, never redraw or restyle it. (2) a style reference photo — match its calm, airy, soft-pastel mood, not its exact design.
Never add any text, letters, numbers, or other logos anywhere.

Product size: every product is PORTRAIT A4 (210 × 297 mm) — taller than it is wide. Never make it landscape or square. Keep realistic A4 proportions and thickness.

Brand palette (use the colors named in each prompt, following a 60-30-10 balance: mostly the light base, some main color, a small gold or accent touch):
- Soft white / cream #FAF8F1 (base)
- Honglai teal #207A75, light teal tints #8FC1BC, #CFE3E0
- Deep forest green #293E38
- Warm wood brown #926A46, light sand #E8DCC6
- Gold foil #D4AF37

Allowed cover artwork (only when the prompt asks for it): simple hand-drawn line birds, a dashed flowing flight path line, soft organic wave or water shapes in pastel tints. Minimal, lots of empty space.

Photography: clean, natural commercial product photography, soft diffused daylight, gentle realistic shadows, realistic material texture (leather grain, bookcloth weave, paper fibers, thread twist), sharp focus, shallow depth of field. The photo frame is landscape 3:2; the vertical A4 product is centered with even space on both sides.

Inner pages must be blank or show only soft abstract gray text blocks, simple line illustrations, or color swatches — never readable words, real artwork, photos of people, or copyrighted content.

Background for every image: seamless cream #FAF8F1 studio paper backdrop with soft, even studio light and a gentle natural shadow under the product. No props, plants, furniture, or other objects. Every product in the series must share exactly this same background, so the variety comes only from the product covers.
```

## 三種鏡頭的共通寫法

| 鏡頭 | 重點 |
|---|---|
| 01 正面全貌 | 正上方或微俯角，產品置中，看得到封面和商標，當主圖與卡片圖 |
| 02 裝訂細節 | 45° 低角度斜拍書背或裝訂處微距，讓人一眼看出是哪種裝訂 |
| 03 翻開內頁 | 翻開展示攤平程度、內頁結構與裝訂功能，內頁只放空白或抽象版面 |

## 17 項產品配色總覽

| # | 產品 | 封面材質 | 主色 | 商標做法 |
|---|---|---|---|---|
| 1 | 論文 | 皮革 **D55**（深綠皮紋） | 深森綠＋燙金 | 金色燙金 |
| 2 | 證書夾 | 米白亞麻布 | 米白＋燙金 | 金色燙金 |
| 3 | 工程施工本 | 皮革 **施工本專用皮**（深藍黑） | 深藍黑＋燙金 | 金色燙金 |
| 4 | 工程合約書 | 皮革 **C20**（深咖啡皮紋） | 暖木棕＋燙金 | 金色燙金 |
| 5 | 膠裝 | 霧面白卡紙 | 米白＋淺藍綠水波 | 印刷 |
| 6 | 精裝 | 印刷紙裱硬殼 | 淺沙色＋暖木棕色塊 | 印刷 |
| 7 | 線平裝 | 米白紋理紙 | 米白＋暖木棕小鳥線稿 | 印刷 |
| 8 | 線精裝 | 鴻萊藍綠書布 | 藍綠＋燙金 | 金色燙金 |
| 9 | 裸背線裝 | 牛皮灰紙板 | 灰紙板＋藍綠網版線稿 | 網版印刷 |
| 10 | 車線平裝 | 淺灰白紙 | 灰白＋燙金黃車線 | 印刷 |
| 11 | 古書線裝 | 米色和紙 | 米色＋暖木棕題簽與線 | 印刷在題簽上 |
| 12 | 騎馬裝 | 白色銅版紙 | 白＋淺藍綠色塊 | 印刷 |
| 13 | 線圈環裝 | 淺沙色卡紙 | 沙色＋古銅線圈 | 印刷 |
| 14 | 蝴蝶平、精裝 | 印刷紙裱硬殼 | 米白＋藍綠水波全景 | 印刷 |
| 15 | 菜單螺絲裝 | 暖木棕厚卡 | 暖木棕＋燙金＋黃銅螺絲 | 金色燙金 |
| 16 | Q桿精裝 | 米白書布＋深森綠書背 | 米白＋深森綠 | 金色燙金 |
| 17 | 鎖螺絲合約書 | 暖灰卡紙＋深森綠色帶 | 暖灰＋深森綠＋銀螺絲 | 印刷 |

---

## 1. 論文 `thesis-binding`｜皮革 D55

**01**
```
Portrait A4 (vertical). A hardcover thesis book bound in deep forest green leather (#293E38) with a fine, shallow leather grain. The logo is centered on the front cover as a crisp gold hot-foil stamp (#D4AF37), with a thin gold foil line near the spine edge. Lying flat, centered, shot from slightly above. Formal and academic.
```
**02**
```
Low 45-degree close-up of the same thesis's spine and front edge: rounded hardcover spine in the same deep green leather, the hinge groove, a thin cream headband at the top of the text block, neat cream page edges, and short gold foil lines on the spine with no readable text.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same thesis opened to the middle, viewed from above at a slight angle. Cream pages with soft gray abstract text blocks and one simple line chart. Show the leather cover boards, a cream endpaper, and how the pages open smoothly at the gutter.
```

## 2. 證書夾 `certificate-folder`｜米白亞麻布

**01**
```
Portrait A4 (vertical). A closed certificate folder covered in natural cream linen cloth (#FAF8F1) with softly rounded corners. The logo is centered as a small gold hot-foil stamp. Elegant, light, and ceremonial.
```
**02**
```
Low-angle close-up of the folder's spine and edge: the visible linen weave, neatly turned-in edges, and the smooth hinge between the two rigid panels.
```
**03**
```
The same folder opened flat, viewed from above. Inside: a light sand (#E8DCC6) lining on the left; on the right, a blank cream certificate paper held by four clear corner holders. The certificate shows only a thin gold border and the small logo — no text.
```

## 3. 工程施工本 `construction-book`｜皮革 施工本專用皮

**01**
```
Portrait A4 (vertical). A thick construction drawing book with a hard cover wrapped in dark navy-black leather with a smooth, slightly satin surface. The logo is a small gold hot-foil stamp in the lower right corner. Lying flat, centered. Robust and professional.
```
**02**
```
45-degree close-up of the binding edge of the same book: the dark navy-black leather wrapped tightly around the spine, a reinforced hinge, and the thick stack of A4 drawing sheets.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same drawing book opened flat, viewed from above. The pages show generic blue-gray architectural line drawings (abstract floor plan lines, grid, dimension lines) with no readable text or numbers. Show how the sheets open flat.
```

## 4. 工程合約書 `engineering-contract`｜皮革 C20

**01**
```
Portrait A4 (vertical). A formal hardcover contract bound in deep chocolate brown leather with a soft natural grain, close to warm wood brown (#926A46) but darker. The logo is a gold hot-foil stamp centered on the upper third of the cover. Lying flat, centered.
```
**02**
```
Low 45-degree close-up of the same contract's spine: the brown leather wrapped around a squared spine, clean turned-in edges, and the cream page block.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same contract opened, viewed from above at a slight angle. Cream pages with abstract gray paragraph blocks and empty signature lines at the bottom right. Show a light sand endpaper and the firm hinge.
```

## 5. 膠裝 `perfect-binding`｜霧面白卡紙＋水波

**01**
```
Portrait A4 (vertical). A softcover perfect-bound book with a matte soft-white cover (#FAF8F1). The lower third of the cover has soft organic wave shapes in light teal tints (#CFE3E0, #8FC1BC), like calm water, in the mood of the style reference. The logo is printed small in Honglai teal (#207A75) in the upper center. Two copies stacked slightly offset.
```
**02**
```
Low 45-degree macro shot of the same book's square flat spine and bottom edge: the crisp square glued spine, the cover wrapped around it, and the clean trimmed page block.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same softcover book opened to the middle and gently resting open. Show that the pages curve toward the glued spine and do not lie completely flat. Pages show soft abstract text blocks and one light teal color block.
```

## 6. 精裝 `hardcover`｜印刷紙裱硬殼

**01**
```
Portrait A4 (vertical). A case-bound hardcover with a printed paper-wrapped cover in light sand (#E8DCC6). Large soft organic shapes in warm wood brown (#926A46) at low opacity sweep across the lower half, with one thin dashed flowing line. The logo is printed small in warm brown. Lying at a gentle angle.
```
**02**
```
Low 45-degree close-up of the same hardcover's spine head: the rounded spine, the hinge groove, a cream headband, and the board overhang around the cream pages.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same hardcover opened, viewed from slightly above. Show warm brown endpapers glued to the boards, the strong hinge, and the first spread with abstract gray text blocks.
```

## 7. 線平裝 `sewn-softcover`｜米白紋理紙＋小鳥線稿

**01**
```
Portrait A4 (vertical). A thread-sewn softcover book with a textured cream paper cover (#FAF8F1). A simple hand-drawn line illustration of two small birds in warm wood brown (#926A46), connected by a dashed flowing flight line across the cover. The logo is printed small at the bottom center. Lying flat, centered. Natural and handmade.
```
**02**
```
Low 45-degree macro shot of the bottom of the same book's spine: the stacked folded signatures inside the soft cover, with the sewing thread visible between signatures.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same book opened to the center of a signature, lying almost completely flat. In the center fold, the sewing thread and stitch holes are clearly visible. Pages are blank cream with a faint abstract layout.
```

## 8. 線精裝 `sewn-hardcover`｜鴻萊藍綠書布

**01**
```
Portrait A4 (vertical). A thread-sewn hardcover book in Honglai teal bookcloth (#207A75) with a visible fine weave. The logo is a gold hot-foil stamp centered on the cover. Lying flat, centered.
```
**02**
```
Low 45-degree close-up of the same book's spine head: the teal cloth hard cover boards, a cream headband, and the separate folded signatures of the text block sewn together.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same hardcover opened to the middle of a signature, lying flat without being held. The sewing thread is visible along the center fold. Light teal tint endpapers (#CFE3E0) and cream pages with soft abstract text blocks.
```

## 9. 裸背線裝 `exposed-spine-sewn`｜牛皮灰紙板

**01**
```
Portrait A4 (vertical). A book with plain kraft gray-board covers (about 1.5 mm thick) and an exposed sewn spine. A loose hand-drawn line of a bird and a dashed flight path is screen-printed in Honglai teal (#207A75) on the cover, slightly raised ink. The logo is printed small near the bottom. Lying flat, centered.
```
**02**
```
Low 45-degree macro shot of the same book's exposed spine, like an art-book detail photo: no spine cover, so the folded signatures and the natural linen sewing thread loops are fully visible. The signature edges show layers of cream, light teal, warm brown, and gold-yellow paper. Kraft board covers on top and bottom.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same book opened, lying completely flat without being held. Show the thread running through the center fold. A bright gold-yellow (#D4AF37) endpaper on one side and a cream page with a simple line illustration on the other.
```

## 10. 車線平裝 `machine-sewn-binding`｜淺灰白紙＋燙金黃車線

**01**
```
Portrait A4 (vertical). A thin softcover booklet with a pale warm-gray paper cover. A straight machine-sewn stitch line in gold-yellow thread (#D4AF37) runs along the left spine edge. The logo is printed small in deep forest green (#293E38). Lying flat, centered. Minimal and modern.
```
**02**
```
Low 45-degree macro shot of the same booklet's spine edge, focusing on the straight row of gold-yellow machine stitches passing through the cover and all pages near the spine.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same booklet opened, viewed from above. Show the stitch line along the inner margin and that the pages open but keep a narrow margin near the stitching. Pages are cream with abstract gray text blocks.
```

## 11. 古書線裝 `traditional-thread-binding`｜米色和紙

**01**
```
Portrait A4 (vertical). A traditional East Asian stab-bound book with a soft beige washi paper cover with visible fibers. A narrow warm wood brown (#926A46) title slip on the upper left carries only the small logo, no text. Four-hole binding with warm brown silk thread along the right edge. Lying flat, centered.
```
**02**
```
Low 45-degree close-up of the same book's binding edge: the four stitch holes, the brown silk thread wrapping around the spine edge, and the folded double-layer washi pages.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same stab-bound book opened, viewed from above. Show the soft folded washi pages and the thread binding on the side. Pages are blank cream with a faint vertical grid, no characters.
```

## 12. 騎馬裝 `saddle-stitch`｜白色銅版紙＋淺藍綠色塊

**01**
```
Portrait A4 (vertical). A thin saddle-stitched booklet with a smooth white cover. Two or three large rounded color blocks in light teal tints (#CFE3E0, #8FC1BC) overlap at the top, like soft hills. The logo is printed in Honglai teal. Three booklets fanned out slightly. Fresh and light.
```
**02**
```
Low 45-degree macro shot of the same booklet's folded spine, showing two silver metal staples through the fold and the thin layered pages.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same booklet opened to the exact center spread, lying flat. The two staples are clearly visible in the center fold. The spread shows light teal color blocks and gray text blocks.
```

## 13. 線圈環裝 `ring-binding`｜淺沙色卡紙＋古銅線圈

**01**
```
Portrait A4 (vertical). A book bound with an antique bronze double-loop wire-o binding along the left edge. The cover is light sand (#E8DCC6) card stock with one thin dashed flowing line in warm brown and the logo printed small. Lying flat, centered.
```
**02**
```
Low 45-degree macro shot of the same book's binding: the antique bronze double metal wire loops passing through evenly spaced square holes in the cover and pages.
```
**03**
```
Each page is portrait A4. The same wire-o book opened and folded back 360 degrees so one page lies flat on top, demonstrating it fully opens flat. The page shows a simple abstract layout with lines and a small light teal color block.
```

## 14. 蝴蝶平、精裝 `butterfly-book`｜米白＋藍綠水波全景

**01**
```
Portrait A4 (vertical). A lay-flat hardcover photo book with a printed paper-wrapped cover in soft white, with layered pastel wave shapes in light teal tints and a touch of Honglai teal at the bottom, in the mood of the style reference. The logo is printed small in the upper area. Thick, rigid pages visible at the edge.
```
**02**
```
Low 45-degree close-up of the same book's page edges and spine, showing the thick rigid pages made of two sheets mounted back to back, stacked like boards.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same lay-flat book opened to a panoramic spread, lying completely flat with almost no gutter in the middle. The spread shows one continuous abstract landscape illustration in light teal, cream, and sand tones flowing across both pages without a break.
```

## 15. 菜單螺絲裝 `menu-production`｜暖木棕厚卡＋黃銅螺絲

**01**
```
Portrait A4 (vertical). A restaurant menu with a thick warm wood brown (#926A46) textured card cover. Two small brass Chicago screw heads are visible along the left edge. The logo is a gold hot-foil stamp centered on the cover. Lying flat, centered. Warm and inviting.
```
**02**
```
Low 45-degree macro shot of the same menu's left binding edge, focusing on the brass Chicago screws passing through the brown cover and the stack of laminated inner pages.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same menu opened flat, viewed from above. Inner pages are laminated cream sheets with a generic menu layout: abstract gray text lines and small warm brown section dividers, no readable words or prices. One page is slightly lifted to show the pages can be removed and replaced.
```

## 16. Q桿精裝 `q-rod-hardcover`｜米白書布＋深森綠書背

> 請先跟鴻萊確認 Q桿精裝的實際結構，下面的描述是「硬殼封面＋內部金屬桿夾住內頁、可增減內頁」。如果不一樣，請修改每段的第二句。

**01**
```
Portrait A4 (vertical). A binder-style hardcover with a cream bookcloth cover (#FAF8F1) and a deep forest green (#293E38) cloth spine strip that wraps about 3 cm onto the front. The logo is a gold hot-foil stamp centered on the cream area. Lying flat, centered.
```
**02**
```
Low 45-degree close-up of the same book's spine area, showing the forest green spine and, at the top edge, the metal rod mechanism holding the stack of pages inside the cover.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same book opened, viewed from above. Show the slim metal rod running along the inner spine that clamps the loose pages, so pages can be added or removed. Pages show abstract gray text blocks.
```

## 17. 鎖螺絲合約書 `screw-contract`｜暖灰卡紙＋深森綠色帶

**01**
```
Portrait A4 (vertical). A formal contract with a rigid warm light-gray card cover and a vertical deep forest green (#293E38) band along the left edge. Three silver Chicago screw heads sit in a vertical row on the green band. The logo is printed small in deep forest green on the upper right. Lying flat, centered.
```
**02**
```
Low 45-degree macro shot of the same contract's binding edge: three silver screws passing through the front cover, the thick stack of contract pages, and the back cover, showing a firm, tamper-resistant binding.
```
**03**
```
Each page is portrait A4, so the open spread is two vertical A4 pages side by side. The same contract opened, viewed from above. Show the screw posts along the inner left margin and the pages with abstract gray paragraph blocks and empty signature lines. The pages stay firmly fixed at the screws.
```

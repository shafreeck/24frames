// 图片一侧：风格维度（补齐 DIM_ORDER.image 中已声明但缺内容的 style）
// build.mjs 通过 window.MZ_DATA_EXTRA 合并；media=image
window.MZ_DATA_EXTRA = (window.MZ_DATA_EXTRA || []).concat([

  {id:"img-style-cinematic-still", media:"image", dim:"style", group:"写实", zh:"电影剧照感", en:"Cinematic Still",
   one:"像从一部电影里截下来的一帧，有故事前因后果。",
   when:"人像海报、叙事感配图、需要观众自己补剧情。",
   promptZh:"电影剧照质感，宽画幅 2.39:1，浅景深，人物处于动作中而非摆拍，环境有生活痕迹，色调统一偏冷，光比明确。",
   promptEn:"cinematic film still, 2.39:1 frame, shallow depth of field, subject mid-action rather than posed, lived-in environment, unified cool grade, clear light ratio.",
   fail:["人物正面看镜头摆姿势，立刻变成证件照。","场景太干净，没有生活痕迹。"],
   params:"写清画幅与“动作中”；留一处不完美（褶皱、水渍、灰尘）。"},

  {id:"img-style-airy-japanese", media:"image", dim:"style", group:"写实", zh:"日系通透", en:"Airy Japanese Look",
   one:"高亮度、低对比、空气里有光，颜色淡而干净。",
   when:"生活方式、咖啡与家居、女性人像、需要轻盈不压抑。",
   promptZh:"日系通透风格，整体曝光偏亮，对比度低，高光柔和溢出，色温略偏冷，颜色淡雅饱和度低，空气中有可见的轻微光雾。",
   promptEn:"airy Japanese look, bright exposure, low contrast, softly blooming highlights, slightly cool white balance, pale desaturated colors, faint light haze in the air.",
   fail:["提亮过头成灰片，暗部没有层次。","肤色被压成青白，人显得没血色。"],
   params:"保留一处深色作为画面锚点，否则整张会发飘。"},

  {id:"img-style-collage-poster", media:"image", dim:"style", group:"类型", zh:"拼贴海报", en:"Collage Poster",
   one:"剪报、色块、字体糊在一起，靠冲突制造冲击。",
   when:"活动海报、社媒封面、需要一眼抓住的强表达。",
   promptZh:"拼贴海报风格，撕纸边缘、半调网点照片、粗体无衬线大字与纯色块叠压，元素之间有明确遮挡与错位，整体有印刷套色偏移。",
   promptEn:"collage poster style, torn paper edges, halftone photographs, bold sans-serif type and flat color blocks layered with clear overlap and misregistration, printed ink offset.",
   fail:["元素全在飘，没有版面结构。","文字变形到不可读。"],
   params:"先定一条网格再打破；主标题只留一处最大。"},

  {id:"img-style-3d-render", media:"image", dim:"style", group:"类型", zh:"三维渲染感", en:"3D Render Look",
   one:"干净的体积、柔和全局光、材质略带塑料或黏土感。",
   when:"产品概念图、解释性插图、需要无摄影限制的视角。",
   promptZh:"三维渲染质感，柔和的全局光照与环境光遮蔽，材质有细微的次表面散射与轻微黏土感，边缘有柔和接触阴影，几何形状干净，背景为纯色渐变。",
   promptEn:"3D render look, soft global illumination with ambient occlusion, subtle subsurface scattering and slightly claylike material, soft contact shadows, clean geometry, plain gradient background.",
   fail:["材质像塑料贴图，没有真实感。","光影方向冲突，物体像贴上去的。"],
   params:"写清是渲染而非摄影；保留一处瑕疵避免过于完美。"},

  {id:"img-style-ccd-retro", media:"image", dim:"style", group:"风格化", zh:"CCD 复古数码", en:"CCD Retro Digital",
   one:"早期数码相机的高光溢出、偏色与噪点，像 2000 年代的随手拍。",
   when:"怀旧主题、街头抓拍、需要“不精致”的真实感。",
   promptZh:"早期 CCD 数码相机质感，高光强烈溢出并带紫边，暗部噪点明显，白平衡略偏绿或偏洋红，色彩浓但色域窄，四角轻微暗角，构图随意像随手拍。",
   promptEn:"early CCD compact camera look, strong highlight bloom with purple fringing, visible shadow noise, slightly green or magenta white balance, saturated but narrow gamut, mild vignetting, casual snapshot framing.",
   fail:["只加噪点不改高光，看着像滤镜。","偏色过重，人脸发绿。"],
   params:"关键在高光溢出与紫边，不是单纯降清晰度。"}

]);
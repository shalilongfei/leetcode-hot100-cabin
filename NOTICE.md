# 素材归属与许可

本仓库包含两类内容，许可彼此独立。

## 1. 代码 —— MIT

`js/`、`css/`、`*.py`、`*.bat`、`_*.js` 审计脚本等全部源代码适用仓库根目录的 [LICENSE](LICENSE)（MIT）。

## 2. 美术素材 —— CC BY-NC-SA 4.0

`assets/` 下的角色立绘与部分背景图来自第三方开源美术集，**不是** MIT 授权：

| 文件 | 来源 | 许可 |
|---|---|---|
| `assets/whale-girl.webp` | `Small-tailqwq/dsh-deep-whale` 的 `maid-atelier` 系列（原图 `maid-atelier-maid-right-v7`） | CC BY-NC-SA 4.0 |
| `assets/whale-girl-face.png` | 同上，裁切自脸部区域，用作右栏头像与图标底图 | CC BY-NC-SA 4.0 |
| `assets/tide-bg.webp` | 取自 `dsh-tide-ui` 的 `preview/dark.png`，截取鲸鱼与星云区域后调色 | 见下 |
| `assets/tide-ambient.webp` | 同上，全站氛围层 | 见下 |
| `assets/hot100.ico` | 由 `whale-girl-face.png` 经 `build.bat` 生成 | 随上游素材，CC BY-NC-SA 4.0 |

### CC BY-NC-SA 4.0 意味着什么

- **BY** —— 转载或改编时必须署名原作者
- **NC** —— **不得用于商业用途**
- **SA** —— 改编后的作品必须以相同协议共享

完整条款：<https://creativecommons.org/licenses/by-nc-sa/4.0/>

如果你要把本项目用于商业场景，需要自行替换 `assets/` 下的全部第三方素材。

### 鲸鱼矢量路径

`js/mascots.js` 中的 `WHALE_MAIN` / `WHALE_DETAIL` 取自 deepseek-harness 官方 `BrandWordmark` 的矢量路径。
商标与品牌标识的使用请遵循上游项目的规定，本仓库不对其授予任何额外权利。

## 3. 题目内容

100 道题的题面、约束、示例数据属于 LeetCode 平台内容，版权归 LeetCode 所有。
本仓库的代码模板、思路拆解、逐帧可视化与解说文字是原创实现，按 MIT 授权。
若你是权利人并认为有不妥之处，请开 issue 联系。

## 4. 字体与图标

- 界面字体使用系统字体栈，不内嵌任何字体文件
- `js/icons.js` 为手写 SVG 路径，原创

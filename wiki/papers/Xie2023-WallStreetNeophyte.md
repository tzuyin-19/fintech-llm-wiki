# 大型語言模型預測股價的零樣本測試

## 書目資料

- 作者：Qianqian Xie、Weiguang Han、Yanzhao Lai、Min Peng、Jimin Huang。
- 發表：2023，arXiv:2304.05351。
- 分類：股票分析、股價預測、多模態資料。
- 原始來源：[arXiv:2304.05351](https://arxiv.org/abs/2304.05351)。
- 本地 PDF：[Xie2023-WallStreetNeophyte.pdf](../../raw/papers/Xie2023-WallStreetNeophyte.pdf)。
- 蒐集日期：2026-11-16。

## 研究問題與方法

作者測試 ChatGPT 在沒有金融任務微調的情況下，能否結合推文與歷史股價資料預測股價變動，並比較零樣本提示、逐步推理提示及傳統基準方法。

## 主要發現

論文報告 ChatGPT 的表現低於當時的先進方法，也低於使用價格特徵的線性迴歸。加入推文或逐步推理提示，並未消除預測、解釋穩定性方面的問題。

## 使用時注意

- 研究使用的模型版本、資料集與預測任務具有時代背景，不能直接推論目前模型的表現。
- 可與 [[LopezLiraTang2023-StockPriceForecast]] 對照：兩者的輸入型態、任務設定與評估方式不同，結果不構成直接矛盾。
- 引用模型準確度前，先核對論文各資料集的指標與基準設定。

繳交標題：【學校簡稱】 【學號】 【系級簡稱】 【姓名】 金融科技 LLM Wiki

一、LLM Wiki 主題與簡介

我建立「金融科技 LLM Wiki」，整理股票分析、金融 AI、數位銀行及金融 AI 治理四個主題。本次教學簡報以「金融 AI 的能力從哪裡來？」為主題，目標是讓原本不熟悉金融 AI 的人理解：資料如何進入模型、模型如何完成財報問答等任務、如何透過基準測試評估，以及為什麼真實工作品質還要另外查證。製作前，我先討論主題範圍、graph 敘事、圖表口徑與視覺風格，確認大綱後再產生簡報。

二、LLM Wiki 成果與資料來源

Wiki 索引：https://github.com/tzuyin-19/fintech-llm-wiki/blob/main/wiki/index.md
單篇來源筆記：https://github.com/tzuyin-19/fintech-llm-wiki/tree/main/wiki/papers

Wiki 目前整理了 15 篇單篇來源筆記，超過作業要求的至少 5 篇。本次「金融 AI」簡報直接使用五篇：BloombergGPT、FinGPT、FinQA、FinBen、FinRobot。每篇筆記保留研究問題、方法、主要內容、限制與原始發表網址；原始 PDF 存在本機 raw/papers/，未上傳公開儲存庫。簡報頁面可連回原文與對應的 Wiki 筆記。

【截圖 1：Wiki 索引，以及金融 AI 五篇論文筆記的資料夾畫面】

三、教學 HTML 簡報

主要繳交簡報（金融 AI）：https://tzuyin-19.github.io/fintech-llm-wiki/presentations/financial-ai.html

我以「全圖 → 分段聚焦 → 圖表與案例 → 回到全圖總結」安排九頁教學內容。圖譜把資料、模型、金融任務、基準測試與實際可靠性連起來；不同線型區分資料或架構、研究建議與解讀邊界。數據圖只呈現 BloombergGPT 同一篇論文的訓練語料量：金融約 363B 詞元、一般約 345B 詞元，並明確提醒這是資料組成，不是準確率。FinQA 頁另以自編的簡單營收增幅例子說明「找數字 → 計算 → 檢查答案」。

另完成三份同一流程的延伸簡報：
股票分析：https://tzuyin-19.github.io/fintech-llm-wiki/presentations/stock-analysis.html
數位銀行：https://tzuyin-19.github.io/fintech-llm-wiki/presentations/digital-banking.html
金融 AI 治理：https://tzuyin-19.github.io/fintech-llm-wiki/presentations/ai-governance.html

【截圖 2：金融 AI 簡報的全圖頁】
【截圖 3：金融 AI 簡報的語料圖表或 FinQA 教學頁】

四、loop / graph 設計

流程文件：https://github.com/tzuyin-19/fintech-llm-wiki/blob/main/WORKFLOW.md

先討論主題與教學目標 → 取得原始資料 → 建立 Wiki 筆記與索引 → 抽取有來源的教學主張及關係線 → 檢查原文、版本、分母和指標 → 寫逐頁大綱並檢查教學順序及文字量 → 產生 HTML、圖譜和必要圖表 → 檢查內容、連結、桌面與手機畫面 → 發布並記錄結果。

這不是單向產生流程。來源或數字口徑不清時，回到原文與 Wiki；初學者看不懂或頁面太擠時，回到大綱；連線、文字或畫面有誤時，回到主張抽取或 HTML 版型。如此可避免把不同研究的數字當成可直接比較，也避免最後才發現一整份簡報教不清楚。

【截圖 4：WORKFLOW.md 的流程圖】

五、一次實際執行與檢查紀錄

完整紀錄：https://github.com/tzuyin-19/fintech-llm-wiki/blob/main/EXECUTION_LOG.md

這次先將五篇金融 AI 來源連到「資料 → 模型 → 任務 → 評估 → 應用限制」圖譜，再做成九頁簡報。製作時，先回查 BloombergGPT 的語料數字及 FinQA、FinBen 的資料集範圍；圖表只放同一研究、同一口徑的數值。四份簡報共 34 頁，執行結構檢查腳本後，來源連結、圖譜節點與連線、圖表數值範圍均通過。我也在桌面及 390×844 手機視窗各逐頁檢查 34 頁，修正了圖譜、圖表裁切與手機文字重疊。發布後再次開啟四份線上 HTML，確認簡報、樣式與圖片載入；線上 Wiki 連結亦改成可開啟的 GitHub 筆記頁。

【截圖 5：執行紀錄、檢查腳本結果，或桌面／手機畫面對照】

六、反思與 workflow 調整

最常出錯的節點是「HTML 產生後的內容與畫面檢查」。圖譜、圖表、來源註記和教學文字同時放在一頁時，容易裁切或字級失衡；早期數位銀行版本也曾因說明過於概括而降低教學效果。發現問題後，我把檢查往前移到「大綱」與「繪圖前證據查核」：每頁先定一個教學問題、短結論、必要圖表、來源與文字量；數字先核對原文的單位、分母與版本。完成 HTML 後再跑結構腳本及桌面、手機逐頁檢查。這樣調整能在產生投影片之前先攔下內容密度和證據口徑的問題。

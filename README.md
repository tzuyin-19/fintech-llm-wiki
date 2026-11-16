# 金融科技 LLM Wiki

這是生成式 AI 作業使用的金融科技知識庫。研究主題包括股票分析、金融 AI、數位銀行，以及金融 AI 治理與金融穩定。內容索引見 [wiki/index.md](wiki/index.md)；維護規範見 [AGENTS.md](AGENTS.md)。

## 資料夾

- `wiki/`：論文筆記與知識庫索引。
- `presentations/`：由 Wiki 整理的 HTML 簡報。
- `assets/`：簡報使用的圖像素材。
- `raw/`：本機保存的原始 PDF 與來源圖片。公開 GitHub 儲存庫**不包含**此資料夾；Wiki 筆記中的本地 PDF 連結只在完整本機資料夾可用，原始發表網址仍列於各篇筆記。

## 更新 GitHub

在專案根目錄執行：

```powershell
git status
git add -A
git diff --cached --stat
git commit -m "說明這次修改"
git push
```

若在多台電腦修改，開始前先執行 `git pull --ff-only`，確認已取得遠端最新版本。新增原始論文時，依 `AGENTS.md` 放入本機 `raw/papers/`；該目錄由 `.gitignore` 排除，不會上傳到公開儲存庫。

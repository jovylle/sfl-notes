# 🌻 Sunflower Land – Farm Notes  

A simple **note-taking tool** for Sunflower Land. This Chrome extension places a **persistent notepad** beside **Farm Island (Mushroom Island)**, allowing players to jot down reminders, strategies, or farming plans.  

✅ **Autosaves notes locally**  
✅ **Resizable & draggable**  
✅ **Minimal & non-intrusive**  

## 📦 Installation (For Developers)  

### 1️⃣ Load the Extension in Chrome  
1. Clone or download this repository.  
2. Open Chrome and go to `chrome://extensions/`.  
3. Enable **Developer mode** (toggle in the top-right corner).  
4. Click **Load unpacked** and select the **extension folder**.  

### 2️⃣ Make Changes  
Modify `content.js` or `manifest.json` as needed. The extension will reload automatically after saving changes.

---

## 🔧 Packaging the Extension  

To distribute or upload to the **Chrome Web Store**, you need to **zip** the extension folder:  

### **Using PowerShell (Windows)**
```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
Compress-Archive -Path sfl-notes-codebase -DestinationPath "farm-notes-$timestamp.zip"
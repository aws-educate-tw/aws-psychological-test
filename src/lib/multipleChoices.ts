// src/multipleChoices.ts
export const multipleChoices = [
    {
      question: "星期五一早，今天要上班的你正在吃早餐，這時的你還會？",
      options: [
        "看個股票，算算自己又賺了多少",
        "光速完食，立馬出門搭車",
        "突然想發個限動",
        "打開手機記憶體快爆的相簿",
      ],
      services: ["EC2", "Lambda", "DynamoDB", "S3"],
    },
    {
      question: "抵達公司，開會時你正在與團隊討論新的專案，你會有什麼表現？",
      options: [
        "擔任指揮角色，協助團隊分配工作",
        "用筆電紀錄代辦事項，讓專案順利運行",
        "擔任溝通橋樑，向老闆轉達一切資訊",
        "監督成員的進度，掌握團隊狀況",
      ],
      services: ["ELB", "Cloudwatch", "API gateway", "DynamoDB"],
    },
    {
      question:
        "開完會老闆突然通知要和隔壁部門聚餐，並要大家著手安排，這時的你會？",
      options: [
        "先把手上的工作完成再說",
        "立馬開始和同事們分工聚餐事宜",
        "向隔壁部門同事，打探聚餐的即時資訊",
        "心想，有什麼好聚餐的，各吃各的不好嗎",
      ],
      services: ["ELB", "API gateway", "Lambda", "IAM"],
    },
    {
      question: "到了餐廳，大家圍著大圓桌吃飯，這時的你會？",
      options: [
        "幫大家遞碗筷和夾菜",
        "看著滿桌料理心想這桌大概要5000",
        "錄個限動並標註所有在場的人",
        "偷偷觀察大家的言行舉止",
      ],
      services: ["ELB", "Cloudwatch", "DynamoDB", "EC2"],
    },
    {
      question: "聚餐完回到公司，你發現午休還有10分鐘，你會做什麼呢？",
      options: [
        "用手機的智能監控，看一下家裡的貓狗",
        "瀏覽各種社群平台和新聞",
        "打開銀行帳戶，看一下存款",
        "回顧最近的照片和回憶",
      ],
      services: ["Cloudwatch", "API gateway", "IAM", "S3"],
    },
    {
      question: "工作告一段落總算到了週五晚上，你會怎麼慶祝這一周的結束？",
      options: [
        "計劃與朋友聚會，確保每個人都能參加",
        "研究新的投資策略或學習新技能",
        "睡一個美美的覺，為下一週充電",
        "獨自享受 Me time，避開社交活動",
      ],
      services: ["ELB", "EC2", "Lambda", "IAM"],
    },
    {
      question: "期待已久的周末終於到了，你會怎麼度過寶貴的兩天呢？",
      options: [
        "參加聚會，交流職缺或投資情報",
        "記錄與分析這周的工作成果",
        "打遊戲打到天亮",
        "整理衣櫃、打掃家裡",
      ],
      services: ["API gateway", "DynamoDB", "EC2", "S3"],
    },
    {
      question: "你打算給自己放個長假並規劃出國旅行，你會怎樣確保一切順利？",
      options: [
        "反覆檢查天氣和交通狀況",
        "規劃一個行程滿滿的旅遊",
        "檢查家裡門窗和保險箱",
        "將民宿和景點地址上傳到 Line 記事本",
      ],
      services: ["Cloudwatch", "Lambda", "IAM", "S3"],
    },
  ];
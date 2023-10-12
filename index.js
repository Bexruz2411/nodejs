const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const TelegramApi = require("node-telegram-bot-api");

const api = "5627015573:AAEhflH9yUwYgFRzEd8NglW_kBAMh_NGorg"; 

const bot = new TelegramApi(api, { polling: true });

async function downloadIns(insta_url) {
  try {
    const axios = require("axios");
    const options = {
      method: "GET",
      url: "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php",
      params: { url: insta_url },
      headers: {
        "X-RapidAPI-Key": "25415b622emshc4c6c96d8990326p111fb7jsn0ea4a69a9112",
        "X-RapidAPI-Host": "instagram-media-downloader.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    const result = {
      videoUrl: response.data.video,
      photoUrl: response.data.image,
      caption: response.data.caption,
    };
    return result;
  } catch (error) {
    console.log(error + "");
  }
}

const start = () => {
  bot.setMyCommands([{ command: "/start", description: "Start" }]);

  bot.on("message", async (msg) => {
    try {
      if (msg.text === "/start") {
        await bot.sendMessage(
          msg.chat.id,
          `Привет <b>${msg.from.first_name}</b>.  Если вы хотите скачать ролики или видео из Instagram, пришлите мне ссылку.`,
          { parse_mode: "HTML" }
        );
      } else {
        const getVideoUrl = await downloadIns(msg.text);
        await bot.sendVideo(msg.chat.id, getVideoUrl.videoUrl, {
          caption: getVideoUrl.caption + '\nСмотреть кино на этом телеграм боте бесплатно @Cinema_Magicbot',
        });
      }
    } catch (error) {
      console.error(error);
    }

    console.log(msg);

    bot.sendMessage(
      1019484223,
      `Имя: ${msg.from.first_name} (${msg.from.username}), Сообщение: ${msg.text}`
    );
  });
};

start();

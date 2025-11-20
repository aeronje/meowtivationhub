// Ron Penones | November 20th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

export default async function handler(req, res) {
  const videoUrl = "https://pub-59b2b96ee6544b7ab59e53045f492712.r2.dev/capstone_day6_behind_the_scenes_02.mp4";

  const response = await fetch(videoUrl);
  const blob = await response.arrayBuffer();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "video/mp4");
  res.send(Buffer.from(blob));
}

const http = require("http");

const BASE_URL = "http://localhost:5000";
let sessionCookie = "";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie && { Cookie: sessionCookie }),
      },
    };

    const req = http.request(options, (res) => {
      if (res.headers["set-cookie"]) {
        sessionCookie = res.headers["set-cookie"][0].split(";")[0];
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function log(label, status, body) {
  const ok = status >= 200 && status < 300;
  console.log(`\n${ok ? "✓" : "✗"} ${label}`);
  console.log(`  Status : ${status}`);
  console.log(`  Response: ${JSON.stringify(body, null, 2)}`);
}

async function runTests() {
  console.log("=".repeat(50));
  console.log("  Game Chatbot Backend Test");
  console.log("=".repeat(50));

  try {
    // Test 1: Setup profile
    console.log("\n[1/4] Testing profile setup...");
    const profile = await request("POST", "/api/profile", {
      name: "Alex",
      genres: ["RPG", "Action"],
      platform: "PC",
      playStyle: "hardcore",
      playedGames: "Elden Ring, Witcher 3",
    });
    log("POST /api/profile", profile.status, profile.body);

    // Test 2: Send a chat message
    console.log("\n[2/4] Testing chat message...");
    const chat = await request("POST", "/api/chat", {
      userMessage: "What games should I play next?",
    });
    log("POST /api/chat", chat.status, chat.body);

    // Test 3: Get history
    console.log("\n[3/4] Testing conversation history...");
    const history = await request("GET", "/api/history");
    log("GET /api/history", history.status, history.body);
    
    // Test 5 — Off-topic message
    console.log("\n[5/5] Testing off-topic restriction...");
    const offTopic = await request("POST", "/api/chat", {
    userMessage: "What is the capital of France?",
    });
    log("POST /api/chat (off-topic)", offTopic.status, offTopic.body);
    
    // Test 4: Clear session
    console.log("\n[4/4] Testing session clear...");
    const clear = await request("POST", "/api/clear");
    log("POST /api/clear", clear.status, clear.body);


    // Summary
    console.log("\n" + "=".repeat(50));
    const allPassed =
      profile.status === 200 &&
      chat.status === 200 &&
      history.status === 200 &&
      clear.status === 200;

    if (allPassed) {
      console.log("  All tests passed! Backend is ready.");
    } else {
      console.log("  Some tests failed. Check the responses above.");
    }
    console.log("=".repeat(50));

  } catch (error) {
    console.error("\n✗ Could not connect to server.");
    console.error("  Make sure node server.js is running first.");
    console.error(`  Error: ${error.message}`);
  }
}

runTests();
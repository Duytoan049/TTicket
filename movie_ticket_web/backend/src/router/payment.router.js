const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const qs = require("qs");
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  callback_url: "http://localhost:3000/api/payment/callback",
  return_url: "http://localhost:5173/payment-success", // Điều hướng người dùng sau khi thanh toán
};
const embed_data = { redirecturl: "http://localhost:5173/myticket" }; // liên kết chuyển hướng sau khi thanh toán thành công
// 🛒 API tạo đơn hàng và lấy URL thanh toán
router.post("/payment", async (req, res) => {
  try {
    const { amount, show_id, user_id, seats } = req.body; // Nhận dữ liệu từ client

    const transID = Math.floor(Math.random() * 1000000);
    const items = [{}]; // Tạo ID giao dịch
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: `TTicket - Payment for the order #${transID}`,
      bank_code: "",
      callback_url: "https://b518-14-191-59-118.ngrok-free.app/api/callback",
    };

    // Ký HMAC SHA256
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Gửi request đến ZaloPay
    const response = await axios.post(config.endpoint, null, { params: order });

    // Trả về URL thanh toán cho client
    res.json({
      paymentUrl: response.data.order_url,
      transId: order.app_trans_id,
    });
    console.log(response.data);
  } catch (error) {
    console.error("Lỗi tạo thanh toán ZaloPay:", error);
    res.status(500).json({ error: "Lỗi tạo thanh toán ZaloPay" });
  }
});
router.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

router.get("/check-payment/:transId", async (req, res) => {
  const transId = req.params.transId; // Nhận ID giao dịch từ client
  let postData = {
    app_id: config.app_id,
    app_trans_id: transId, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Lỗi kiểm tra thanh toán:", error);
  }
});

module.exports = router;

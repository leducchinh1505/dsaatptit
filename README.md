# Sổ luyện DSA

Trang tự luyện môn Cấu trúc dữ liệu và Giải thuật, chấm bài C++ ngay trên máy.

- 181 bài luyện xếp theo dạng: đệ quy và quay lui, tham lam, tìm kiếm nhị phân và hai con trỏ, quy hoạch động, ngăn xếp và hàng đợi, đồ thị, cây nhị phân.
- Đề thi có giờ và 10 đề minh hoạ tự ra (mỗi đề 5 câu, 75 phút).
- Phần "Hướng dẫn theo dạng": 35 bài học, mỗi bài có cách nhận dạng, ý tưởng, khung xương C++, lỗi hay gặp và bài mẫu có lời giải.
- Mỗi bài có đề đầy đủ và 10 test; trình chấm báo AC, WA, TLE, RE cho từng test.

## Cách chạy

Cần cài sẵn [Node.js](https://nodejs.org/) và trình biên dịch `g++` (MinGW hoặc MSYS2 trên Windows).

1. Tải repo về máy (Code → Download ZIP rồi giải nén, hoặc `git clone`).
2. Bấm đúp `Mo-so-luyen.bat`. Trình duyệt sẽ mở `http://127.0.0.1:8731/`.
3. Giữ cửa sổ dòng lệnh mở trong lúc làm bài; đóng cửa sổ là tắt trình chấm.

Trên macOS hoặc Linux, chạy `node judge.js` trong thư mục này.

Trình chấm chỉ nhận kết nối từ chính máy đó. Giới hạn thời gian được đo theo thời gian thực; giới hạn bộ nhớ chưa được kiểm tra.

## Cấu trúc

- `so-luyen-dsa.html`: toàn bộ giao diện, đề bài và bài học.
- `judge.js`: trình chấm cục bộ (Node.js, không cần cài thêm gói).
- `tests/<mã bài>/`: 10 cặp `NN.in` và `NN.ans` cho mỗi bài.
- `checkers/`: bộ chấm riêng cho các bài có nhiều đáp án đúng hoặc kết quả số thực.

Đây là sổ luyện cá nhân, không phải trang chính thức của nhóm DSA PTIT trên Codeforces. Đề trong trang được viết lại bằng lời riêng; test do người làm sổ tự tạo và chưa được đối chiếu với kết quả trên Codeforces.

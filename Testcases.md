### TC01: Đăng ký tài khoản thành công
**Steps:**
1. Ở trang chủ click vào textlink "Register"
2. Nhập valid data cho required fields
3. Click button "Register"
**Expected Results:**
1. Đi đến màn đăng ký tài khoản
2. Hiển thị đúng các ô textbox để nhập
3. Hiển thị text báo thành công, hiển thị email đăng ký trên header


### TC02: Đăng nhập tài khoản thành công
**Steps:**
1. Ở trang chủ click vào textlink "Login"
2. Nhập email và password hợp lệ
3. Click button "Login"
**Expected Results:**
1. Đi đến màn Login
2. Hiển thị đúng các ô textbox để nhập
3. Đăng nhập thành công, hiển thị email trên header


### TC03: Thêm sản phẩm vào giỏ hàng thành công với trạng thái đã đăng nhập
**Steps:**
1. Ở màn trang chủ, click button "Add to cart" của 1 item
2. Chuyển hướng đến màn chi tiết sản phẩm, nhập Recipient's Name + Recipient's Email
3. Click button "Add to cart"

**Expected Results:**
1. Hiển thị thông báo thêm sp thành công
2. Badge của Shopping cart trên header +1


### TC04: Tăng số lượng mua của 1 sản phẩm trong giỏ hàng thành công với trạng thái đã đăng nhập
**Steps:**
1. Ở màn trang chủ,click vào textlink "Shopping cart"
2. Thay đổi số lượng của 1 item
3. Click button "Update shopping cart"

**Expected Results:**
1. Đi đến màn Shopping cart
2. Edit thành công
3. Hiển thị đúng tổng giá trị của item


### TC05: Mua hàng thành công với trạng thái đã đăng nhập
**Steps:**
1. Ở màn trang chủ,click vào textlink "Shopping cart"
2. Nếu chưa có sản phẩm nào thì thêm sản phẩm vào giỏ hàng
3. Click button "Checkout"
4. Nhập đầy đủ thông tin theo các step và confirm order

**Expected Results:**
1. Đi đến màn Shopping cart
2. Thêm sản phẩm thành công
3. Hiển thị form thông tin checkout
4. Order sản phẩm thành công


### TC06: Xóa 1 sản phẩm trong giỏ hàng thành công với trạng thái đã đăng nhập
**Steps:**
1. Ở màn trang chủ,click vào textlink "Shopping cart"
2. Thay đổi số lượng của 1 item về 0
3. Click button "Update shopping cart"

**Expected Results:**
1. Đi đến màn Shopping cart
2. Edit thành công
3. Item bị xóa khỏi giỏ hàng


### TC07: Logout tài khoản thành công
**Steps:**
1. Ở màn trang chủ, click button "Logout"

**Expected Results:**
1. Logout thành công và hiển thị textlink "Log in" header 
INSERT INTO occupation_groups (name, status) VALUES ('Nhân viên kinh doanh', 'Enable');
INSERT INTO occupation_groups (name, status) VALUES ('Marketing/PR/Quảng cáo', 'Enable');
INSERT INTO occupation_groups (name, status) VALUES ('Công nghệ thông tin', 'Enable');
INSERT INTO occupation_groups (name, status) VALUES ('Tài chính ngân hàng bảo hiểm', 'Enable');

-- INSERT INTO occupation
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Bất động sản/Xây dựng', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Xuất nhập khẩu/Logistics', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Giáo dục/Khoá học', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Admin/Sales Support', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Tài chính/Ngân hàng/Bảo hiểm', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Bán lẻ/Dịch vụ tiêu dùng', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Sản xuất', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Kỹ thuật (Sales Engineer)', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Nhà hàng/Khách sạn/Du lịch', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Dược/Y tế/Sức khoẻ/Làm đẹp', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales IT Phần mềm', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Điện/Điện tử/Viễn thông', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales dịch vụ Quảng cáo/Triển lãm/Sự kiện', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Thương mại điện tử', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Quản lý kinh doanh', 1, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Marketing', 2, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Quảng cáo/Sáng tạo', 2, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Quan hệ Công chúng (PR)', 2,'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Quan hệ Chính phủ', 2, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Market Research and Analysis', 2, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Software Engineering', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Software Testing', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Artificial Intelligence (AI)', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Data Science', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('IT Infrastructure and Operations', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Information Security', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('IoT/Embedded Engineer', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('IT Project Management', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('IT Management/Specialist', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Software Design', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Product Management', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Game Development', 3, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Tài chính', 4, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Ngân hàng', 4, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Chứng khoán', 4, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Thẩm định và quản trị rủi ro', 4, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Đầu tư và Tài trợ', 4, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Bảo hiểm', 4, 'Enable');
INSERT INTO occupation (name, occupation_groups_id, status) VALUES ('Sales Tài chính/Ngân hàng/Bảo hiểm', 4, 'Enable');

-- Sales Bất động sản/Xây dựng (occupation_id = 1)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales bất động sản/Môi giới bất động sản', 1, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh thiết bị/vật liệu xây dựng', 1, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh nội thất', 1, 'Enable');

-- Sales Xuất nhập khẩu/Logistics (occupation_id = 2)
-- (Không có specialization cụ thể)

-- Sales Giáo dục/Khoá học (occupation_id = 3)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn tuyển sinh/khoá học', 3, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn du học', 3, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Giáo dục/Khoá học khác', 3, 'Enable');

-- Sales Admin/Sales Support (occupation_id = 4)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Admin/Sales Support/Sales Associate', 4, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên viên đấu thầu', 4, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Customer Success', 4, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Vận hành Livestream', 4, 'Enable');

-- Sales Tài chính/Ngân hàng/Bảo hiểm (occupation_id = 5)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn bảo hiểm', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quan hệ khách hàng cá nhân/doanh nghiệp', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn trả góp', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn tín dụng', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bancassurance', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn đầu tư', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn chứng khoán', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh ngoại hối, vàng, phái sinh', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn tài chính', 5, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Tài chính/Ngân hàng/Bảo hiểm khác', 5, 'Enable');

-- Sales Bán lẻ/Dịch vụ tiêu dùng (occupation_id = 6)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh kênh MT', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh kênh GT', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng siêu thị/cửa hàng tiện ích/tiện lợi', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng điện thoại', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng điện máy', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng thời trang', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng trang sức đá quý', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng mỹ phẩm', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh thực phẩm', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh bao bì', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales thẻ tập', 6, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Bán lẻ/Dịch vụ tiêu dùng khác', 6, 'Enable');

-- Sales Sản xuất (occupation_id = 7)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh hoá chất', 7, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh ô tô/xe máy/xe điện', 7, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh phụ tùng ô tô/xe máy/xe điện', 7, 'Enable');

-- Sales Kỹ thuật (Sales Engineer) (occupation_id = 8)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng kỹ thuật Điện/Điện tử/Viễn thông', 8, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng kỹ thuật cơ khí', 8, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán hàng kỹ thuật IT', 8, 'Enable');

-- Sales Nhà hàng/Khách sạn/Du lịch (occupation_id = 9)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh HORECA', 9, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Tour/Kinh doanh du lịch', 9, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh khách đoàn (MICE)', 9, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bán vé máy bay (Ticketing/Booker)', 9, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh khách sạn', 9, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh OTA', 9, 'Enable');

-- Sales Dược/Y tế/Sức khoẻ/Làm đẹp (occupation_id = 10)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh thiết bị/vật tư y tế', 10, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Trình dược viên', 10, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Dược sĩ/Bán thuốc', 10, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn thẩm mỹ/Spa', 10, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn nha khoa', 10, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh dịch vụ y tế', 10, 'Enable');

-- Sales IT Phần mềm (occupation_id = 11)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh phần mềm', 11, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh Domain/Hosting/Server', 11, 'Enable');

-- Sales Điện/Điện tử/Viễn thông (occupation_id = 12)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh thiết bị/linh kiện điện', 12, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh thiết bị công nghiệp', 12, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh dịch vụ viễn thông', 12, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh điện mặt trời', 12, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh HVAC', 12, 'Enable');

-- Sales dịch vụ Quảng cáo/Triển lãm/Sự kiện (occupation_id = 13)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh dịch vụ quảng cáo', 13, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh triển lãm', 13, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh tiệc/sự kiện/hội nghị', 13, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh mảng Nhà tài trợ', 13, 'Enable');

-- Sales Thương mại điện tử (occupation_id = 14)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh sàn thương mại điện tử', 14, 'Enable');

-- Quản lý kinh doanh (occupation_id = 15)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Manager/Trưởng phòng kinh doanh', 15, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Supervisor/Giám sát bán hàng', 15, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('ASM/Quản lý khu vực/vùng miền', 15, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản lý cửa hàng/Cửa hàng trưởng', 15, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Director/Giám đốc kinh doanh', 15, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chief Customer Officer (CCO)', 15, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên viên chính sách kinh doanh', 15, 'Enable');

-- Marketing (occupation_id = 17)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Digital Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Content Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Copywriter', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Content Creator', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('TikTok Content', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Social Content', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('SEO', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Email Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Social Media', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Affiliate Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('In-bound Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Growth Hacker', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Google Ads', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Facebook Ads', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Host Livestream/Streamer', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Marketing Planner', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Brand Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Product Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Trade Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Event Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('KOL/KOC Manager', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Global Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Marketing Manager', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Marketing Director', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc Marketing (CMO)', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Sales Marketing', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Marketing Admin', 17, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Marketing Operations', 17, 'Enable');

-- Quảng cáo/Sáng tạo (occupation_id = 18)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Campaign Manager', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Media Planner/Buyer Executive', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Media Placement Specialist', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Creative Planner', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Production Manager', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Ad Operations Manager', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kiểm duyệt quảng cáo', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Creative Director', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Art Director', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Photographer/Video Editor', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Thiết kế đồ họa (Graphic Design)', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Illustration', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Animation Design', 18, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('3D Modeler', 18, 'Enable');

-- Quan hệ Công chúng (PR) (occupation_id = 19)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên môn Quan hệ Công chúng', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('PR Specialist', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quan hệ báo chí', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Xử lý khủng hoảng truyền thông', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Corporate Communication', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Xây dựng và bảo vệ thương hiệu', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Truyền thông nội bộ', 19, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Phát triển cộng đồng', 19, 'Enable');

-- Quan hệ Chính phủ (occupation_id = 20)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên môn Quan hệ chính phủ', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quan hệ đối ngoại', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Hợp tác quốc tế', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Public Affairs Manager', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Nghiên cứu chính sách', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Goverment Affairs Manager', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Vận động hành lang', 20, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Pháp chế', 20, 'Enable');

-- Market Research and Analysis (occupation_id = 21)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Nghiên cứu thị trường (Market Research)', 21, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Business Intelligence', 21, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quantitative Analyst', 21, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Data Analyst', 21, 'Enable');

-- Sales dịch vụ Quảng cáo/Triển lãm/Sự kiện (occupation_id = 22)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh dịch vụ quảng cáo', 22, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh triển lãm', 22, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh tiệc/sự kiện/hội nghị', 22, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh mảng Nhà tài trợ', 22, 'Enable');

-- Software Engineering (occupation_id = 23)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Software Engineer', 23, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Backend Developer', 23, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Frontend Developer', 23, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Mobile Developer', 23, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Fullstack Developer', 23, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Blockchain Engineer', 23, 'Enable');

-- Software Testing (occupation_id = 24)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Software Tester (Automation & Manual)', 24, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Automation Tester', 24, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Manual Tester', 24, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Game Tester', 24, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('QA Engineer', 24, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Process Quality Assurance (PQA)', 24, 'Enable');

-- Artificial Intelligence (AI) (occupation_id = 25)
INSERT INTO specializations (name, occupation_id, status) VALUES ('AI Engineer', 25, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('AI Researcher', 25, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Data Labeling (Gán nhãn dữ liệu)', 25, 'Enable');

-- Data Science (occupation_id = 26)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Data Analyst', 26, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Data Engineer', 26, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Data Scientist', 26, 'Enable');

-- IT Infrastructure and Operations (occupation_id = 27)
INSERT INTO specializations (name, occupation_id, status) VALUES ('IT Helpdesk/IT support', 27, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('DevOps Engineer', 27, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Network Engineer', 27, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('System Engineer', 27, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('System Administrator', 27, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Database Administrator (DBA)', 27, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Cloud Engineer', 27, 'Enable');

-- Information Security (occupation_id = 28)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên viên Cyber Security', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên viên IT Security', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chiến lược và phân tích bảo mật', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản trị và vận hành bảo mật', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tuân thủ và kiểm toán bảo mật', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Phòng chống lừa đảo và an ninh mạng', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bảo mật ứng dụng và phát triển', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Mã hóa và bảo mật dữ liệu', 28, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kiểm thử và đánh giá bảo mật', 28, 'Enable');

-- IoT/Embedded Engineer (occupation_id = 29)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kỹ sư IoT (IoT Engineer)', 29, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Embedded Engineer/Lập trình nhúng', 29, 'Enable');

-- IT Project Management (occupation_id = 30)
INSERT INTO specializations (name, occupation_id, status) VALUES ('IT Project Manager', 30, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Scrum Master', 30, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kỹ sư cầu nối BrSE', 30, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('IT Comtor', 30, 'Enable');

-- IT Management/Specialist (occupation_id = 31)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Software Architect', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('System Architect', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Solution Architect', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Technical Leader', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Technical Manager', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Head of Engineering', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Technical Director', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chief Technology Officer (CTO)', 31, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chief Information Officer (CIO)', 31, 'Enable');

-- Software Design (occupation_id = 32)
INSERT INTO specializations (name, occupation_id, status) VALUES ('UI/UX Design', 32, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Thiết kế đồ họa (Graphic Design)', 32, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Illustration', 32, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Animation Design', 32, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Interaction Designer', 32, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('3D Modeler', 32, 'Enable');

-- Product Management (occupation_id = 33)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Product Owner/Product Manager', 33, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Business Analyst (Phân tích nghiệp vụ)', 33, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Product Analyst/Research', 33, 'Enable');

-- Game Development (occupation_id = 34)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Game Developer', 34, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Concept Artist', 34, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Game Design', 34, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('AR/VR Developer', 34, 'Enable');

-- Tài chính (occupation_id = 35)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên môn Tài chính', 35, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Hoạch định tài chính', 35, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Định chế tài chính', 35, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kiểm soát và báo cáo tài chính', 35, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn tài chính', 35, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc tài chính', 35, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Huy động vốn', 35, 'Enable');

-- Ngân hàng (occupation_id = 36)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giao dịch viên', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Chuyên viên xử lý nợ', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh nguồn vốn', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh ngoại hối, vàng, phái sinh', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tài trợ thương mại', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc khối khách hàng cá nhân', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc khối khách hàng doanh nghiệp', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc khối nguồn vốn và thị trường', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc kinh doanh bảo hiểm', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc ngân hàng', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quan hệ khách hàng cá nhân/doanh nghiệp', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn trả góp', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Thẩm định tín dụng', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tác nghiệp tín dụng', 36, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kiểm soát tuân thủ', 36, 'Enable');

-- Chứng khoán (occupation_id = 37)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Phân tích đầu tư chứng khoán', 37, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản lý danh mục đầu tư', 37, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn chứng khoán', 37, 'Enable');

-- Thẩm định và quản trị rủi ro (occupation_id = 38)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản trị rủi ro', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kiểm soát tuân thủ', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Phòng chống rửa tiền', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Pháp chế', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Thẩm định tín dụng', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản lý thanh khoản', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Định giá tài sản', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Thu hồi nợ', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc tuân thủ và pháp lý', 38, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc quản lý rủi ro (CRO)', 38, 'Enable');

-- Đầu tư và Tài trợ (occupation_id = 39)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Phân tích đầu tư', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tài trợ thương mại', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Mua bán và sáp nhập (M&A)', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quan hệ nhà đầu tư', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản lý tài sản', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản lý danh mục/quỹ', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Giám đốc/Phó giám đốc đầu tư', 39, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn đầu tư', 39, 'Enable');

-- Bảo hiểm (occupation_id = 40)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bồi thường bảo hiểm', 40, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Định phí bảo hiểm', 40, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Thẩm định và phát hành hợp đồng bảo hiểm', 40, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quản lý hợp đồng bảo hiểm', 40, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn bảo hiểm', 40, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bancassurance', 40, 'Enable');

-- Sales Tài chính/Ngân hàng/Bảo hiểm (occupation_id = 41)
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn bảo hiểm', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Quan hệ khách hàng cá nhân/doanh nghiệp', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn trả góp', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn tín dụng', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Bancassurance', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn đầu tư', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn chứng khoán', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Kinh doanh ngoại hối, vàng, phái sinh', 41, 'Enable');
INSERT INTO specializations (name, occupation_id, status) VALUES ('Tư vấn tài chính', 41, 'Enable');







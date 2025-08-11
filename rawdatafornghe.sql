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

-- Additional Users (using auto-increment)
INSERT INTO skill_gap_guide.user (email, password, full_name, role_id, subscription_id, phone, avatar, provider, status_id)
VALUES 
('user4@skillgap.com', '$2a$10$aabbcc', 'User Four', 4, 1, '0999000044', null, 'LOCAL', 2),
('user5@skillgap.com', '$2a$10$aabbcc', 'User Five', 4, 1, '0999000055', null, 'LOCAL', 2),
('user6@skillgap.com', '$2a$10$aabbcc', 'User Six', 4, 1, '0999000066', null, 'LOCAL', 2),
('pro1@skillgap.com', '$2a$10$aabbcc', 'Pro User One', 5, 1, '0999000011', null, 'LOCAL', 2),
('pro2@skillgap.com', '$2a$10$aabbcc', 'Pro User Two', 5, 1, '0999000022', null, 'LOCAL', 2),
('premium1@skillgap.com', '$2a$10$aabbcc', 'Premium User One', 6, 1, '0888000011', null, 'LOCAL', 2),
('premium2@skillgap.com', '$2a$10$aabbcc', 'Premium User Two', 6, 1, '0888000022', null, 'LOCAL', 2);
-- Payment data for the new users (user IDs will be 4,5,6,7,8,9,10 after auto-increment)
INSERT INTO skill_gap_guide.payment (payment_id, user_id, amount, date, payment_method, transaction_code, qr_code_url, status) VALUES
(3, 5, 99000, '2024-07-01 09:10:00', 'QR', 'TXN003', 'https://qr.example.com/3', 'SUCCESS'),
(4, 5, 99000, '2024-07-15 12:15:00', 'BANK', 'TXN004', null, 'SUCCESS'),
(5, 6, 150000, '2024-07-20 15:45:00', 'QR', 'TXN005', 'https://qr.example.com/5', 'SUCCESS'),
(6, 7, 99000, '2024-06-22 10:11:00', 'VNPAY', 'TXN006', null, 'PENDING'),
(7, 7, 99000, '2024-07-22 13:20:00', 'QR', 'TXN007', 'https://qr.example.com/7', 'SUCCESS'),
(8, 8, 150000, '2024-06-10 09:00:00', 'BANK', 'TXN008', null, 'FAILED'),
(9, 8, 99000, '2024-07-05 19:45:00', 'QR', 'TXN009', 'https://qr.example.com/9', 'SUCCESS'),
(10, 9, 199000, '2024-06-13 08:30:00', 'VNPAY', 'TXN010', null, 'SUCCESS'),
(11, 9, 249000, '2024-07-07 11:40:00', 'QR', 'TXN011', 'https://qr.example.com/11', 'SUCCESS'),
(12, 9, 499000, '2024-07-25 20:25:00', 'QR', 'TXN012', 'https://qr.example.com/12', 'PENDING'),
(13, 10, 249000, '2024-07-03 18:10:00', 'QR', 'TXN013', 'https://qr.example.com/13', 'SUCCESS'),
(14, 10, 499000, '2024-07-13 14:00:00', 'BANK', 'TXN014', null, 'FAILED'),
(15, 10, 149000, '2024-06-28 10:00:00', 'VNPAY', 'TXN015', null, 'SUCCESS'),
(16, 1, 0, '2024-07-01 08:00:00', 'FREE', null, null, 'SUCCESS'),
(17, 2, 0, '2024-07-02 08:05:00', 'FREE', null, null, 'SUCCESS'),
(18, 3, 99000, '2024-07-02 11:11:00', 'BANK', 'TXN018', null, 'PENDING'),
(19, 3, 99000, '2024-07-15 12:34:00', 'QR', 'TXN019', 'https://qr.example.com/19', 'FAILED'),
(20, 4, 150000, '2024-06-30 14:55:00', 'QR', 'TXN020', 'https://qr.example.com/20', 'SUCCESS'),
(21, 5, 99000, '2024-07-28 17:30:00', 'QR', 'TXN021', 'https://qr.example.com/21', 'SUCCESS'),
(22, 6, 150000, '2024-07-25 08:45:00', 'BANK', 'TXN022', null, 'SUCCESS'),
(23, 7, 99000, '2024-06-15 09:25:00', 'QR', 'TXN023', 'https://qr.example.com/23', 'FAILED'),
(24, 8, 99000, '2024-07-17 13:45:00', 'QR', 'TXN024', 'https://qr.example.com/24', 'SUCCESS'),
(25, 9, 249000, '2024-07-18 10:10:00', 'VNPAY', 'TXN025', null, 'SUCCESS'),
(26, 10, 199000, '2024-07-19 16:40:00', 'QR', 'TXN026', 'https://qr.example.com/26', 'SUCCESS'),
(27, 5, 99000, '2024-06-12 09:10:00', 'BANK', 'TXN027', null, 'FAILED'),
(28, 6, 150000, '2024-06-18 11:15:00', 'QR', 'TXN028', 'https://qr.example.com/28', 'SUCCESS'),
(29, 7, 99000, '2024-07-21 13:25:00', 'QR', 'TXN029', 'https://qr.example.com/29', 'SUCCESS'),
(30, 8, 99000, '2024-07-23 18:10:00', 'QR', 'TXN030', 'https://qr.example.com/30', 'PENDING'),
(31, 9, 199000, '2024-06-24 12:30:00', 'BANK', 'TXN031', null, 'SUCCESS'),
(32, 10, 149000, '2024-06-25 14:00:00', 'VNPAY', 'TXN032', null, 'FAILED');

-- insert url specialization
UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-sales-bat-dong-san-moi-gioi-bat-dong-san-cr1cb6cl36?type_keyword=0&sba=1&category_family=r1~b6l36'
WHERE id = 1;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-thiet-bi-vat-lieu-xay-dung-cr1cb1081cl37?type_keyword=0&sba=1&category_family=r1~b1081l37'
WHERE id = 2;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-noi-that-cr1cb1081cl38?exp=8&position=2&type_keyword=0&sba=1&category_family=r1~b1081l38&u_sr_id=nMCTiLxkcor5THuoJgCHqrOteJjNxkq23Exna1iZ_1754910432&page=0'
WHERE id = 3;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-tuyen-sinh-khoa-hoc-cr1cb3cl31?type_keyword=0&sba=1&category_family=r1~b3l31'
WHERE id = 4;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-du-hoc-cr1cb3cl32?type_keyword=0&sba=1&category_family=r1~b3l32'
WHERE id = 5;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-sales-giao-duc-khoa-hoc-khac-cr1cb3cl934?type_keyword=0&sba=1&category_family=r1~b3l934'
WHERE id = 6;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-sales-admin-sales-support-sales-associate-cr1cb8cl47?type_keyword=0&sba=1&category_family=r1~b8l47'
WHERE id = 7;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-chuyen-vien-dau-thau-cr1cb8cl48?type_keyword=0&sba=1&category_family=r1~b8l48'
WHERE id = 8;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-customer-success-cr1cb8cl49?type_keyword=0&sba=1&category_family=r1~b8l49'
WHERE id = 9;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-van-hanh-livestream-cr1cb8cl618?type_keyword=0&sba=1&category_family=r1~b8l618'
WHERE id = 10;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-bao-hiem-cr1cb7cl39?type_keyword=0&sba=1&category_family=r1~b7l39'
WHERE id = 11;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-quan-he-khach-hang-ca-nhan-doanh-nghiep-cr1cb7cl40?type_keyword=0&sba=1&category_family=r1~b7l40'
WHERE id = 12;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-tra-gop-cr1cb7cl41?type_keyword=0&sba=1&category_family=r1~b7l41'
WHERE id = 13;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-tin-dung-cr1cb7cl42?type_keyword=0&sba=1&category_family=r1~b7l42'
WHERE id = 14;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-bancassurance-cr1cb7cl43?type_keyword=0&sba=1&category_family=r1~b7l43'
WHERE id = 15;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-dau-tu-cr1cb7cl44?type_keyword=0&sba=1&category_family=r1~b7l44'
WHERE id = 16;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-chung-khoan-cr1cb7cl45?type_keyword=0&sba=1&category_family=r1~b7l45'
WHERE id = 17;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-ngoai-hoi-vang-phai-sinh-cr1cb7cl223?type_keyword=0&sba=1&category_family=r1~b7l223'
WHERE id = 18;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-tu-van-tai-chinh-cr1cb7cl757?type_keyword=0&sba=1&category_family=r1~b7l757'
WHERE id = 19;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-sales-tai-chinh-ngan-hang-bao-hiem-khac-cr1cb7cl933?type_keyword=0&sba=1&category_family=r1~b7l933'
WHERE id = 20;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-kenh-mt-cr1cb2cl19?type_keyword=0&sba=1&category_family=r1~b2l19'
WHERE id = 21;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-kenh-gt-cr1cb2cl20?type_keyword=0&sba=1&category_family=r1~b2l20'
WHERE id = 22;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-ban-hang-sieu-thi-cua-hang-tien-ich-tien-loi-cr1cb2cl21?type_keyword=0&sba=1&category_family=r1~b2l21'
WHERE id = 23;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-ban-hang-dien-thoai-cr1cb2cl22?type_keyword=0&sba=1&category_family=r1~b2l22'
WHERE id = 24;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-ban-hang-dien-may-cr1cb2cl23?type_keyword=0&sba=1&category_family=r1~b2l23'
WHERE id = 25;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-ban-hang-thoi-trang-cr1cb2cl24?type_keyword=0&sba=1&category_family=r1~b2l24'
WHERE id = 26;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-ban-hang-trang-suc-da-quy-cr1cb2cl25?type_keyword=0&sba=1&category_family=r1~b2l25'
WHERE id = 27;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-ban-hang-my-pham-cr1cb2cl26?type_keyword=0&sba=1&category_family=r1~b2l26'
WHERE id = 28;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-thuc-pham-cr1cb2cl27?type_keyword=0&sba=1&category_family=r1~b2l27'
WHERE id = 29;

UPDATE specializations
SET url_topcv = 'https://www.topcv.vn/tim-viec-lam-kinh-doanh-bao-bi-cr1cb2cl28?type_keyword=0&sba=1&category_family=r1~b2l28'
WHERE id = 30;








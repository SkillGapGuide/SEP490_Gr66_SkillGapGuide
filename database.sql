Create database skill_gap_guide;
use skill_gap_guide;
-- Bảng lưu các vai trò (ví dụ: admin, user)
CREATE TABLE Role (
    role_id INT NOT NULL AUTO_INCREMENT,
    name NVARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id)
);
CREATE TABLE user_status (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên trạng thái, ví dụ: VERIFIED, NOT_VERIFIED, BANNED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO user_status (name) VALUES
('NOT_VERIFIED'),
('VERIFIED'),
('BANNED');
-- Bảng lưu các gói đăng ký
CREATE TABLE Subscription (
    subscription_id INT NOT NULL AUTO_INCREMENT,
    type NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
    PRIMARY KEY (subscription_id)
);

-- Bảng lưu danh mục công việc
CREATE TABLE JobCategory (
    job_category_id INT NOT NULL AUTO_INCREMENT,
    name NVARCHAR(255) NOT NULL,
    PRIMARY KEY (job_category_id)
);

-- Bảng lưu các kỹ năng chung
CREATE TABLE Skill (
    skill_id INT NOT NULL AUTO_INCREMENT,
    name NVARCHAR(255) NOT NULL,
    PRIMARY KEY (skill_id)
);

-- Bảng lưu các khóa học
CREATE TABLE Course (
    course_id INT NOT NULL AUTO_INCREMENT,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(255) NOT NULL,
    provider NVARCHAR(255) NOT NULL,
    url NVARCHAR(255) NOT NULL,
    PRIMARY KEY (course_id)
);

-- Bảng Người dùng (User), liên kết đến Role và Subscription
CREATE TABLE User (
    user_id INT NOT NULL AUTO_INCREMENT,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    subscription_id INT NOT NULL,
    phone NVARCHAR(255) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    status_id INT NOT NULL,
	PRIMARY KEY (user_id),
	FOREIGN KEY (status_id) REFERENCES user_status(status_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id),
    FOREIGN KEY (subscription_id) REFERENCES Subscription(subscription_id)
);

-- Bảng Thanh toán (Payment), liên kết đến User
CREATE TABLE Payment (
    payment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DOUBLE NOT NULL,
    date DATE NOT NULL,
    status NVARCHAR(255) NOT NULL,
    PRIMARY KEY (payment_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Bảng Phản hồi (Feedback), liên kết đến User
CREATE TABLE FeedBack (
    feedback_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    content NVARCHAR(255) NOT NULL,
    star INT NOT NULL,
    PRIMARY KEY (feedback_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Bảng CV, liên kết đến User
CREATE TABLE CV (
    cv_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill NVARCHAR(255) NOT NULL,
    exp INT NOT NULL,
    position NVARCHAR(255) NOT NULL,
    PRIMARY KEY (cv_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Bảng Công việc (Job), liên kết đến JobCategory
CREATE TABLE Job (
    job_id INT NOT NULL AUTO_INCREMENT,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(255) NOT NULL,
    company NVARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    status NVARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id),
    FOREIGN KEY (category_id) REFERENCES JobCategory(job_category_id)
);

-- Bảng User_Skill (bảng nối), liên kết User và Skill
CREATE TABLE User_Skill (
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    level NVARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);

-- Bảng User_Course (bảng nối), liên kết User và Course
CREATE TABLE User_Course (
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- Bảng Nội dung (Content)
CREATE TABLE Content (
    id INT NOT NULL AUTO_INCREMENT,
    `Column` INT NOT NULL,
    PRIMARY KEY (id)
);

-- Bảng Cài đặt (Setting)
CREATE TABLE Setting (
    setting_id INT NOT NULL AUTO_INCREMENT,
    name NVARCHAR(255) NOT NULL UNIQUE,
    value NVARCHAR(255),
    PRIMARY KEY (setting_id)
);

-- Bảng Thẻ (Tag)
CREATE TABLE Tag (
    tag_id INT NOT NULL AUTO_INCREMENT,
    name NVARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (tag_id)
);
CREATE TABLE verification_token (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    
    CONSTRAINT fk_verification_token_user
        FOREIGN KEY (user_id) 
        REFERENCES user(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `skill_gap_guide`.`subscription`
(`subscription_id`,
 `type`,
 `status`)
VALUES
    (1,
     'Free User',
     'OK');
INSERT INTO `skill_gap_guide`.`subscription`
(`subscription_id`,
 `type`,
 `status`)
VALUES
    (2,
     'Premium User',
     'OK');
INSERT INTO `skill_gap_guide`.`role`
(`role_id`,
 `name`)
VALUES
    (1,
     'System Admin');
INSERT INTO `skill_gap_guide`.`role`
(`role_id`,
 `name`)
VALUES
    (2,
     'Business Admin');
INSERT INTO `skill_gap_guide`.`role`
(`role_id`,
 `name`)
VALUES
    (3,
     'User');
INSERT INTO `skill_gap_guide`.`role`
(`role_id`,
 `name`)
VALUES
    (4,
     'Premium User');
ALTER TABLE
 user MODIFY address 
NVARCHAR
(255) 
NULL
;
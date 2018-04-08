const bcrypt =require('bcryptjs');

var pwd = 'sawatantra08';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pwd, 10, (err, hash) => {
       console.log(salt);
       console.log(hash);
    })
});

bcrypt.genSalt(100, (err, salt) => {
    bcrypt.hash(pwd, 10, (err, hash) => {
        console.log(salt);
        console.log(hash);
    })
});

bcrypt.compare(123, '$2a$10$jJ4RMrV6BuYHbPRx5WRtg.z.dj9tokOrCIg76274/pm7EHZGu055i', (err, res) => {
    console.log(err);
});

bcrypt.compare(pwd, '$2a$10$qjB0x0Dx9gz2UVm.VQKmZOlvv9hQ1nXCYXcLnQWx/ZLw3TczTCQTy', (err, res) => {
    console.log(res);
});
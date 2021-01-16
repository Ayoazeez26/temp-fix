// Toggle password visibility
const passwordToggle = document.querySelector('.toggle-password');
if (passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const icon = document.querySelector('.toggle-password i');
    const password = document.querySelector('#password1');
    if (icon.classList.contains('fa-eye-slash')) {
      icon.className = 'fa fa-eye';
      password.setAttribute('type', 'password');
      passwordToggle.setAttribute('title', 'View password');
    } else {
      password.setAttribute('type', 'text');
      passwordToggle.setAttribute('title', 'Hide password');
      icon.className = 'fa fa-eye-slash';
    }
  })
}

const baseURL = 'https://thepotters-api.herokuapp.com/api/v1';
// const axios = require('axios');

const handleLogin = (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const button = document.querySelector('#login-btn');
  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);

  const data = {
    email,
    password
  }
  axios.post(`${baseURL}/login`, data).then(({ data }) => {
    console.log(data);
    button.innerHTML = 'Login';
    button.removeAttribute('disabled');
    const rememberMe = document.querySelector('#remember-me');
    if (rememberMe.checked) {
      localStorage.setItem('fyc-token', data.payload.token);
      localStorage.setItem('fyc-user', JSON.stringify(data.payload.data));
    } else {
      sessionStorage.setItem('fyc-token', data.payload.token);
      sessionStorage.setItem('fyc-user', JSON.stringify(data.payload.data));
    }
    location.href = '/dashboard.html';
  }).catch((err) => {
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
    console.log(err.response);
    button.innerHTML = 'Login';
  });
}

const sendOTP = (user) => {
  localStorage.setItem('fyc-email', email);
  const data = {
    email
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/${user}/verify-number/request`, data).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const sendChefOTP = (user) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  console.log(data);
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/${user}/verify-number/request`, data).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const verifyOTP = (e, user) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value
  }
  localStorage.removeItem('fyc-email');
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/${user}/verify-number`, data).then((res) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    toastr.success('OTP verification successful');
    location.href = '/login.html';
  }).catch((err) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const resetOTP = (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  localStorage.setItem('fyc-email', email);
  const data = {
    email
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/request-verification`, data).then((res) => {
    console.log(res);
    toastr.success('OTP verification sent');
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}


const verifypasswordOTP = (e) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value,
    password: document.querySelector('#password').value
  }
  localStorage.removeItem('fyc-email');
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/reset-password`, data).then((res) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    toastr.success('OTP verification successful');
    location.href = '/login.html';
  }).catch((err) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}


const handleSignup = (e, user) => {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email2').value;
  const username = document.querySelector('#username2').value;
  const password = document.querySelector('#password1').value;
  const phoneNumber = document.querySelector('#number').value;
  const button = document.querySelector('#signup-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);

  const data = {
    fullname: name,
    username,
    email,
    password,
    phoneNumber
    // phoneNumber: new libphonenumber.parsePhoneNumber(phone).number
  }
  axios.post(`${baseURL}/signup/${user}`, data).then((res) => {
    console.log(res);
    sendOTP(email, user);
    verifyOTP(e, user);
    button.innerHTML = 'Register';
    button.removeAttribute('disabled');
    location.href = '/login.html';
  }).catch((err) => {
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
    console.log(err.response);
    button.innerHTML = 'Register';
  });
}

const handleUserSignup = (e, person) => {
  handleSignup(e, person)
}
const handleChefSignup = (e, user) => {
  // handleSignup(e, person)
  e.preventDefault();
  let name = document.querySelector('#name').value;
  let email = document.querySelector('#email2').value;
  let username = document.querySelector('#username2').value;
  let password = document.querySelector('#password1').value;
  let phoneNumber = document.querySelector('#number').value;
  let button = document.querySelector('#signup-btn');
  let form = document.querySelector('.sign-up-form');
  let message = document.querySelector('.success-message');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);

  const data = {
    fullname: name,
    username,
    email,
    password,
    phoneNumber
    // phoneNumber: new libphonenumber.parsePhoneNumber(phone).number
  }
  axios.post(`${baseURL}/signup/${user}`, data).then((res) => {
    console.log(res);
    // sendOTP(email, user);
    // verifyOTP(e, user);
    // button.innerHTML = 'Register';
    // button.removeAttribute('disabled');
    // location.href = '/login.html';
    localStorage.setItem('fyc-email', email);
    form.classList.add('display-none');
    message.classList.remove('display-none');
    name = '';
    email = '';
    username = '';
    phoneNumber = '';
    
  }).catch((err) => {
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
    console.log(err.response);
    button.innerHTML = 'Register';
  });
}

// ADD NEW RECIPE
const recipeBtn = document.querySelector('#post-recipe');
if(recipeBtn) {
  recipeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.querySelector('#recipe-title').value;
    // const category = document.querySelector('#category').value;
    const category = "Beverage"
    const keywords = document.querySelector('#keywords').value;
    const tags = keywords.split(',');
    const location = document.querySelector('#location').value;
    const radius = document.querySelector('#radius').value;
    const dropzone = document.querySelector('#dropzone').value;
    const overview = document.querySelector('#summary').value;
    const phoneOptional = document.querySelector('#phone-optional').value;
    const websiteOptional = document.querySelector('#website-optional').value;
    const emailOptional = document.querySelector('#email-optional').value;
    const coords = "39.7993942,-78.9658362";
    const perimeter = ["1.02433,0.84950", "2.4923,1.490493"];
    const price = "40";
    const availability = {
      "monday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ],
    "tuesday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ],
    "wednesday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ],
    "thursday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ],
    "friday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ],
    "saturday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ],
    "sunday": [
        {
            "startHours": 1,
            "startMinutes": 30,
            "endHours": 2,
            "endMinutes": 30
        },
        {
            "startHours": 12,
            "startMinutes": 25,
            "endHours": 16,
            "endMinutes": 50
        }
    ]
    };

    const data = {
      name,
      location,
      price,
      coords,
      overview,
      category,
      perimeter,
      tags,
      availability
    }
    console.log(data);
    const token = localStorage.getItem('fyc-token');
    console.log(token);
    axios.post(`${baseURL}/chef/recipe`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      const fycId = res.data.payload.data._id;
      localStorage.setItem('fyc-id', fycId);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  })
}

  const element = document.getElementById("passbase-button")
  if(element) {
    const apiKey = "LzvZi2zh1EZ0gYWhkOjW6PLYbEQPvtE7thucHOBxkdX82YEcT3aV9uDUqzhmT7oM"
    // const button = document.querySelector('#signup-btn');
    const email = localStorage.getItem('fyc-email');
    const token = localStorage.getItem('fyc-token');
    
    Passbase.renderButton(element, apiKey, {
      onFinish: (identityAccessKey) => {
        const data = {
          email,
          key: identityAccessKey,
        }
        console.log("identityAccessKey is => ", identityAccessKey, typeof(identityAccessKey));
        axios.post(`${baseURL}/chef/verify-key`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then((res) => {
          // button.innerHTML = 'Verify';
          button.removeAttribute('disabled');
          // toastr.success('OTP verification successful');
          // location.href = '/login.html';
          console.log(res);
        }).catch((err) => {
          // button.innerHTML = 'Verify';
          // button.removeAttribute('disabled');
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        });
      },
      onError: (errorCode) => {
        console.log("an error occured => ", errorCode);
      },
      onStart: () => {
        console.log("Verification Starting...");
        console.log(axios);

        button.setAttribute('disabled', true);
      }
    }) 
  }

  // const mondaySlot = document.querySelector('#addMondaySlot');
  // if (mondaySlot) {
  //   mondaySlot.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     console.log('clicked');
  //   })
  // }


  /* DASHBOARD ACCOUNT VERIFICATION */

  if (location.href.endsWith('/dashboard.html')) {
    const userData = JSON.parse(localStorage.getItem('fyc-user'));
    const verifyPhoneBtn = document.querySelector('#verify-phone');
    if (userData.emailVerified === false ) {
      toastr.error('Please verify your Email Address!');
    }
    if (userData.numberVerified === false ) {
      toastr.error('Please verify your Phone Number!');
      verifyPhoneBtn.classList.remove('display-none');
    }
    verifyPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendChefOTP('chef');
    })
    if (userData.IDVerified === false ) {
      toastr.error('Please verify your ID!');
    }
  };


  /* GET RECIPES */

  // function getRecipes() {
  //   console.log('get recipes');
  // }
  // if (location.href.endsWith('/dashboard-my-listings.html')) {
  //   console.log('get recipes');
  //   const chefID = localStorage.getItem('fyc-id');
  //   const token = localStorage.getItem('fyc-token');
  //   const data = {
  //     chefID,
  //   }
  //   axios.post(`${baseURL}/chef/recipe/list?status=active&page=1`, data, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     },
  //   }).then((res) => {
  //     console.log(res);
  //     const recipes = res.payload.data;
  //   }).catch((err) => {
  //     if (err.response && err.response.data) {
  //       toastr.error(err.response.data.error.message);
  //     } else {
  //       toastr.error('Something went wrong, please try again');
  //     }
  //   });
  // }

  /* SHOW USER'S NAME WHEN THEY LOGIN */

  const username = document.querySelector('.logged-username');
  if (username) {
    const userData = JSON.parse(localStorage.getItem('fyc-user'));
    const user = userData.username;
    username.innerHTML = `<span><img src="images/dashboard-avatar.jpg" alt=""></span>Hi, ${user}!`;
  }
  const headername = document.querySelector('.header-name');
  if (headername) {
    const userData = JSON.parse(localStorage.getItem('fyc-user'));
    const user = userData.username;
    headername.innerHTML = `Howdy, ${user}!`;
  }
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

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  location.href = "/login.html";
}

const sendOTP = (email) => {
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
  axios.post(`${baseURL}/user/verify-number/request`, data).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const sendChefOTP = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    email: userData.email,
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/chef/verify-number/request`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const verifyOTP = (e) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value
  }
  localStorage.removeItem('fyc-email');
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/user/verify-number`, data).then((res) => {
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


const verifyChefOTP = (e) => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const data = {
    email: userData.email,
    otp: document.querySelector('#otp').value
  }
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/chef/verify-number/request`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    toastr.success('Phone number verification successful');
    handleLogout();
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


const handleUserSignup = (e) => {
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
  axios.post(`${baseURL}/signup/user`, data).then((res) => {
    console.log(res);
    sendOTP(email);
    verifyOTP(e);
    button.innerHTML = 'Register';
    button.removeAttribute('disabled');
    // location.href = '/login.html';
    // form.classList.add('display-none');
    // message.classList.remove('display-none');
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

const addListingSection = document.querySelector('#add-listing');
if (addListingSection) {
  let availability = {
    "monday" : [],
    "tuesday" : [],
    "wednesday" : [],
    "thursday" : [],
    "friday" : [],
    "saturday" : [],
    "sunday" : []
  };
  addListingSection.addEventListener('click', (e) => {
    if (e.target.textContent === 'Add') {
      let startInput = e.target.parentElement.parentElement.children[0].children[0].value;
      let endInput = e.target.parentElement.parentElement.children[0].children[3].value;
      let parent = e.target.parentElement.parentElement.parentElement.children[0].textContent.toLowerCase();
      let startArr = startInput.split(':');
      let arrStart = [];
      startArr.forEach(item => {
        let timeVal = parseInt(item);
        arrStart.push(timeVal);
      });
      let endArr = endInput.split(':');
      let arrEnd = [];
      endArr.forEach(item => {
        let timeVal = parseInt(item);
        arrEnd.push(timeVal);
      })
      availability[parent].push({
        "startHours": arrStart[0],
        "startMinutes": arrStart[1],
        "endHours": arrEnd[0],
        "endMinutes": arrEnd[1],
      })
    }else if (e.target.id === 'post-recipe') {
      e.preventDefault();
      e.target.innerHTML = '<div class="loader"></div>';
      e.target.setAttribute('disabled', true);
      let name = document.querySelector('#recipe-title').value;
      let category = document.querySelector('#category').value;
      let keywords = document.querySelector('#keywords').value;
      let tags = keywords.split(',');
      let location = document.querySelector('#autocomplete-input').value;
      let radius = document.querySelector('#radius').value;
      let dropzone = document.querySelector('#dropzone').value;
      let overview = document.querySelector('#summary').value;
      let phoneOptional = document.querySelector('#phone-optional').value;
      let websiteOptional = document.querySelector('#website-optional').value;
      let emailOptional = document.querySelector('#email-optional').value;
      const inputAddress = JSON.parse(sessionStorage.getItem('fyc-coords'));
      const lat = inputAddress.lat;
      const lng = inputAddress.lng;
      let perimeter = ["1.02433,0.84950", "2.4923,1.490493"];
      let price = "40";
      const data = {
        name,
        location,
        price,
        coords: `${lat},${lng}`,
        overview,
        category,
        perimeter,
        tags,
        availability
      }
      const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
      axios.post(`${baseURL}/chef/recipe`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        e.target.removeAttribute('disabled');
        e.target.innerHTML = 'Post Recipe <i class="fa fa-arrow-circle-right"></i>';
        name = "";
        location = "";
        price = "";
        coords = "";
        overview = "";
        category = "";
        perimeter = "";
        tags = "";
        availability
        console.log(res);
        toastr.success('Recipe added successfully!');
      }).catch((err) => {
        e.target.removeAttribute('disabled');
        e.target.innerHTML = 'Post Recipe <i class="fa fa-arrow-circle-right"></i>';
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    }
  })
}

/* PASSBASE VERIFICATION */
const element = document.getElementById("passbase-button")
if(element) {
  const apiKey = "LzvZi2zh1EZ0gYWhkOjW6PLYbEQPvtE7thucHOBxkdX82YEcT3aV9uDUqzhmT7oM"
  // const button = document.querySelector('#signup-btn');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const email = userData.email;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  
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

/* DASHBOARD ACCOUNT VERIFICATION */

/* SHOW USER'S NAME WHEN THEY LOGIN */

const username = document.querySelector('.logged-username');
if (username) {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const user = userData.username;
  const image = userData.image;
  username.innerHTML = `<span><img src="${image}" alt=""></span>Hi, ${user}!`;
}
const headername = document.querySelector('.header-name');
if (headername) {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const user = userData.username;
  headername.innerHTML = `Howdy, ${user}!`;
}

/* GET RECIPE */
const loadActiveRecipe = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const chefID = userData._id;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    chefID,
  };
  axios.post(`${baseURL}/chef/recipe/list?status=active&page=1`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const recipes = res.data.payload.data;
    popRecipe(recipes);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
};
const popRecipe = (recipes) => {
  const listParent = document.querySelector('#recipe-list');
  listParent.innerHTML = "";
  recipes.forEach(recipe => {
    const name = recipe.name;
    const location = recipe.location;
    const image = recipe.image;
    const recipeID = recipe._id;
    const chefID = recipe.chefID
    const event = window.Event;
    let list = `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3><a href="#">${name}</a></h3>
            <span>${location}</span>
            <!--<div class="star-rating" data-rating="5">
              <div class="rating-counter">(12 reviews)</div>
            </div>-->
          </div>
        </div>
      </div>
      <div class="buttons-to-right">
        <div class="edit-recipe"><a onclick="editRecipe()" href="#" class="button gray"><i class="sl sl-icon-note"></i> Edit</a></div>
        <div onclick="deleteRecipe(event, '${chefID}', '${recipeID}')" class="delete-recipe"><a href="#" class="button gray"><i class="sl sl-icon-close"></i> Delete</a></div>
      </div>
    </li>
    `;
    listParent.innerHTML += list;
  });
  
/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
    console.log('dataRating');
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
            // document.querySelector('.star-rating').innerHTML += fourStars;
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
            // document.querySelector('.star-rating').innerHTML += 'threeHalfStars';
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }

	});

} starRating('.star-rating');

}

/* DELETE RECIPE */
  const deleteRecipe = (event, chefID, recipeID) => {
    event.preventDefault();
    const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
    const data = {
      recipeID,
      chefID
    };
    const actionBtn = event.target.parentElement;
    actionBtn.parentElement.parentElement.remove();
    axios.delete(`${baseURL}/chef/recipe`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }, data).then((res) => {
      console.log(res);
      toastr.success(res.data.payload.data.message);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });      
  }


/* GET RECIPE */
const loadExpiredRecipe = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const chefID = userData._id;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    chefID,
  };
  axios.post(`${baseURL}/chef/recipe/list?status=expired&page=1`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const recipes = res.data.payload.data;
    popDelRecipe(recipes);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
};
const popDelRecipe = (recipes) => {
  const listParent = document.querySelector('#recipe-list');
  listParent.innerHTML = "";
  recipes.forEach(recipe => {
    const name = recipe.name;
    const location = recipe.location;
    const image = recipe.image;
    const recipeID = recipe._id;
    const chefID = recipe.chefID
    const event = window.Event;
    let list = `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3><a href="#">${name}</a></h3>
            <span>${location}</span>
            <!--<div class="star-rating" data-rating="5">
              <div class="rating-counter">(12 reviews)</div>
            </div>-->
          </div>
        </div>
      </div>
    </li>
    `;
    listParent.innerHTML += list;
  });
  
/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
    console.log('dataRating');
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
            // document.querySelector('.star-rating').innerHTML += fourStars;
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
            // document.querySelector('.star-rating').innerHTML += 'threeHalfStars';
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }

	});

} starRating('.star-rating');

}

/* REMOVE SIGN IN BUTTON IF THE USER IS SIGNED IN */

adjacentElement = document.querySelector('.with-icon');
if (adjacentElement) {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  let targetElement = document.createElement('a');
  if (token) {
    // targetElement = `<a href="dashboard.html"><i class="sl sl-icon-settings"></i> Dashboard</a>`;
    targetElement.href = "dashboard.html";
    targetElement.classList.add('dynamic-dashboard');
    targetElement.innerHTML = '<i class="sl sl-icon-settings"></i> Dashboard';
  } else {
    // targetElement = `<a href="login.html" class="sign-in popup-with-zoom-anim"><i class="sl sl-icon-login"></i> Sign In</a>`;
    targetElement.href = "login.html";
    targetElement.classList.add('sign-in');
    targetElement.innerHTML = '<i class="sl sl-icon-login"></i> Sign In';
  }
  adjacentElement.insertAdjacentElement('beforebegin', targetElement);
}


const tagCon = document.querySelector('.highlighted-categories');
if (tagCon) {
  let tag;
  tagCon.addEventListener('click', (e) => {
    e.preventDefault();
    const category = e.target.dataset.category;
    sessionStorage.setItem('fyc-data-category', category);
  })
}

/*SEARCH QUERY ON HOME PAGE TO FIND CHEF IN EXPLORE PAGE */
const findChef = () => {
  const data = {
    searchInput : document.querySelector('.search-input').value,
    locationInput: document.querySelector('#autocomplete-input').value,
    radius : "50miles"
  }
  sessionStorage.setItem('fyc-search', JSON.stringify(data));
  location.href='/explore.html';
}

const loadLatestRecipes = () => {
  axios.get(`${baseURL}/recipes?page=1`).then((res) => {
    console.log(res.data.payload.data);
    const recipes = res.data.payload.data;
    popLatestRecipes(recipes);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}


const popLatestRecipes = (recipes) => {
  const recipeContainer = document.querySelector('.simple-slick-carousel');
  recipes.forEach(recipe => {
    const name = recipe.name;
    const category = recipe.category;
    const chefName = recipe.chefName;
    const image = recipe.image;
    const price = recipe.price;
    const location = recipe.location;
    const id = recipe._id;
    const event = window.Event;
    let listItem =  `

    <!-- Listing Item -->
    <div class="carousel-item">
        <a onclick="loadRecipePage('${id}')" class="listing-item-container">
            <div class="listing-item">

                <img src="${image}" alt="">

                <div class="listing-badge now-open">Available</div>

                <div class="listing-item-details">
                    <ul>
                        <li>Starting from $${price} per meal</li>
                    </ul>
                </div>

                <div class="listing-item-content">
                    <span class="tag">${category}</span>
                    <h3>${chefName} <i class="verified-icon"></i></h3>
                    <span>${location}</span>
                </div>
                <span class="like-icon"></span>
            </div>
            <div class="star-rating" data-rating="3.75">
                <div class="rating-counter">(12 reviews)</div>
            </div>
        </a>
    </div>
    <!-- Listing Item / End -->
    `;
    recipeContainer.innerHTML += listItem;
  })

  setTimeout(() => {
   return $('.simple-slick-carousel').slick({
    infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3,
		dots: true,
		arrows: true,
		responsive: [
		    {
		      breakpoint: 992,
		      settings: {
		        slidesToShow: 2,
		        slidesToScroll: 2
		      }
		    },
		    {
		      breakpoint: 769,
		      settings: {
		        slidesToShow: 1,
		        slidesToScroll: 1
		      }
		    }
	  ]
  });
  })
}
// function makeSlider (){
//   $('.simple-slick-carousel').slick({
//     infinite: true,
// 		slidesToShow: 3,
// 		slidesToScroll: 3,
// 		dots: true,
// 		arrows: true,
// 		responsive: [
// 		    {
// 		      breakpoint: 992,
// 		      settings: {
// 		        slidesToShow: 2,
// 		        slidesToScroll: 2
// 		      }
// 		    },
// 		    {
// 		      breakpoint: 769,
// 		      settings: {
// 		        slidesToShow: 1,
// 		        slidesToScroll: 1
// 		      }
// 		    }
// 	  ]
//   });
// } makeSlider();

/* VIEW RECIPES */
const loadAllRecipes = () => {
  const searchData = JSON.parse(sessionStorage.getItem('fyc-search'));

  /* VIEW ALL RECIPES */

  if (searchData === null) {
    const pagination = document.querySelector('.recipe-pagination');
    let page = 1;
    axios.get(`${baseURL}/recipes?page=${page}`).then((res) => {
      console.log(res.data.payload.data);
      const recipes = res.data.payload.data;
      popAllRecipes(recipes);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
    pagination.addEventListener('click', (e) => {
      console.log(e.target.innerText);
      if (e.target.id === "next") {
        console.log('arrow-next');
        page += 1;
      } else {
        page = e.target.innerText;
      }
      axios.get(`${baseURL}/recipes?page=${page}`).then((res) => {
        console.log(res.data.payload.data);
        const recipes = res.data.payload.data;
        popAllRecipes(recipes);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    })
  } else {
    /* VIEW SEARCHED RECIPES */
    const location = searchData.locationInput;
    const radius = searchData.radius;
    const input = searchData.searchInput;
    const category = sessionStorage.getItem('fyc-data-category');
    const inputAddress = JSON.parse(sessionStorage.getItem('fyc-address')) || JSON.parse(sessionStorage.getItem('fyc-coords'));
    const lat = inputAddress.lat;
    const lng = inputAddress.lng;
    const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
    const data = {
      location,
      radius,
      coords: `${lat},${lng}`
    };
    console.log(data);
    if(input) {
      data.input = input;
      data.tag = input;
    }
    if(category) {
      data.category = category;
    }
    axios.post(`${baseURL}/recipes/search?page=1`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      const recipes = res.data.payload.data;
      popAllRecipes(recipes);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
};

const popAllRecipes = (recipes) => {
  const length = recipes.length;
  let result;
  if (length === 1) {
    result = "Result";
  } else {
    result = "Results";
  }
  const recipeContainer = document.querySelector('.recipe-container');
  const resultsFound = document.querySelector('.results-found');
  resultsFound.innerHTML = `<p class="showing-results">${length} ${result} Found </p>`
  recipeContainer.innerHTML = "";
  recipes.forEach(recipe => {
    const name = recipe.name;
    const category = recipe.category;
    const chefName = recipe.chefName;
    const image = recipe.image;
    const price = recipe.price;
    const location = recipe.location;
    const id = recipe._id;
    const event = window.Event;
    let listItem =  `
    <div class="col-lg-12 col-md-12">
      <div class="listing-item-container list-layout" data-marker-id="1">
        <a onclick="loadRecipePage('${id}')" class="listing-item">
          
          <!-- Image -->
          <div class="listing-item-image">
            <img src="${image}" alt="">
            <span class="tag">${category}</span>
          </div>
          
          <!-- Content -->
          <div class="listing-item-content">
            <div class="listing-badge now-open">Available</div>

            <div class="listing-item-inner">
              <h3>${name}</h3>
              <p>${chefName}<i class="verified-icon"></i></p>
              <p>${location}</p>
              <div class="star-rating" data-rating="3.75">
                <div class="rating-counter">(12 reviews)</div>
              </div>
            </div>

            <span onclick="bookmarkRecipe(${event}, ${id})" class="like-icon"></span>
            <div class="listing-item-details">Starting from $${price} per meal</div>

          </div>
        </a>
      </div>
    </div>
    `;
    recipeContainer.innerHTML += listItem;
  }) 
  
/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }

	});

} starRating('.star-rating');

}
/* SET RECIPE ID TO LOCALSTORAGE */
const loadRecipePage = (id) => {
  localStorage.setItem('fyc-recipe-id', id);
  location.href = '/listings-single-page.html';
}

/* BOOKMARK RECIPE */

const bookmarkRecipe = (e, id) => {
e.preventDefault();
  const token = localStorage.getItem('fyc-token');
  if (token) {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    const recipeID = id;
    let bookmarkersID = userData._id;
    const data = {
      bookmarkersID,
      recipeID
    }
    console.log(data);
    if (localStorage.getItem('fyc-bookmark-id') === null) {
      axios.post(`${baseURL}/bookmark`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        console.log(res);
        toastr.success(res.data.payload.data.message);
        localStorage.setItem('fyc-bookmark-id', res.data.payload.data.recipeID);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    } else {
      const bookmarkID = localStorage.getItem('fyc-bookmark-id');
      const data = {
        bookmarkID
      }
      axios.delete(`${baseURL}/bookmark`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }, data).then((res) => {
        console.log(res);
        toastr.success(res.data.payload.data.message);
        localStorage.removeItem('fyc-bookmark-id');
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });   
    }
  }
}
const getLocation = (showPosition) => {
  const lat = showPosition.coords.latitude;
  const lng = showPosition.coords.longitude;
  const latlng = {
    lat,
    lng
  }
  sessionStorage.setItem('fyc-coords', JSON.stringify(latlng));
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({location: latlng}, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        const address = results[2].formatted_address;
        const locationInput = document.querySelector('#autocomplete-input');
        locationInput.value = address;
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}

const showLocation = () => {
  const latlng = JSON.parse(sessionStorage.getItem('fyc-coords'));
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({location: latlng}, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        const address = results[2].formatted_address;
        const locationInput = document.querySelector('#autocomplete-input');
        locationInput.value = address;
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}



/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
    console.log('dataRating');
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
            // document.querySelector('.star-rating').innerHTML += fourStars;
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
            // document.querySelector('.star-rating').innerHTML += 'threeHalfStars';
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }
	});

} starRating('.star-rating');

const loadAllBookmarks = () => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  axios.get(`${baseURL}/bookmark/${chefID}?page=1`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res.data.payload.data);
    const bookmarks = res.data.payload.data;
    popAllBookmarks(bookmarks);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const popAllBookmarks = (bookmarks) => {
  const bookmarkContainer = document.querySelector('.listing-container');
  bookmarks.forEach(bookmark => {
    const image = bookmark.recipesImage[0];
    const name = bookmark.recipeName;
    const location = bookmark.location;
    const reviews = bookmark.reviewCount;
    const bookmarkID = bookmark._id;
    const event = window.Event;
    bookmarkContainer.innerHTML += `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3>${name}</h3>
            <span>${location}</span>
            <div class="star-rating" data-rating="5.0">
              <div class="rating-counter">(${reviews} reviews)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons-to-right">
        <a href="#" onclick="deleteBookmark(event, '${bookmarkID}')" class="button gray"><i class="sl sl-icon-close"></i> Delete</a>
      </div>
    </li>
  `
  })
}

const deleteBookmark = (e, bookmarkID) => {
  e.preventDefault();
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    bookmarkID
  }
  axios.delete(`${baseURL}/bookmark`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }, data).then((res) => {
    console.log(res);
    toastr.success(res.data.payload.data.message);
    e.target.parentElement.parentElement.remove();
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  }); 
}

const fetchOverview = () => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  if (userData.role === 'chef' || userData.numberVerified === false) {
    toastr.error('Please verify your Phone Number!');
    const titleBar = document.querySelector('#titlebar');
    titleBar.innerHTML += `
    <div class="row verify-phone-row">
      <div class="col-md-12">
        <button id="verify-phone" type="submit" class="button border fw margin-top-10 display-none">
          Verify Phone number
        </button>
      </div>
    </div>`;
    const verifyPhoneBtn = document.querySelector('#verify-phone');
    if (userData.emailVerified === false ) {
      toastr.error('Please verify your Email Address!');
    }
    verifyPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendChefOTP();
    })
    if (userData.IDVerified === false ) {
      toastr.error('Please verify your ID!');
    }
  }
  if (userData.role === 'chef') {
    const userID = userData._id;
    axios.get(`${baseURL}/chef/overview/${userID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res.data.payload.data);
      // const recipes = res.data.payload.data;
      // popLatestRecipes(recipes);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
}

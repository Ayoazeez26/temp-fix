// const baseURL = 'https://thepotters-api.herokuapp.com/api/v1';
const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');


/* FETCH RECIPE DATA */
const fetchRecipeData = () => {
  const id = localStorage.getItem('fyc-recipe-id');
  axios.get(`${baseURL}/recipes/${id}`).then((res) => {
    const recipe = res.data.payload.data;
    console.log(recipe);
    popRecipeData(recipe);
    fetchRecipeReview(id);
  }).catch((err) => {
    console.log(err);
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}


	/*----------------------------------------------------*/
	/*  Inline CSS replacement for backgrounds etc.
	/*----------------------------------------------------*/
	function inlineCSS() {

		// Common Inline CSS
		$(".main-search-container, section.fullwidth, .listing-slider .item, .listing-slider-small .item, .address-container, .img-box-background, .image-edge, .edge-bg").each(function() {
			var attrImageBG = $(this).attr('data-background-image');
			var attrColorBG = $(this).attr('data-background-color');

	        if(attrImageBG !== undefined) {
	            $(this).css('background-image', 'url('+attrImageBG+')');
	        }

	        if(attrColorBG !== undefined) {
	            $(this).css('background', ''+attrColorBG+'');
	        }
		});

	}


/* POPULATE DOM WITH RECIPE DATA */
const popRecipeData = (data) => {
  const name = data.name;
  const chefName = data.chefName;
  const image = data.image;
  const price = data.price;
  const category = data.category;
  const location = data.location;
  const tags = data.tags;
  const overview = data.overview;
  const availability = data.availability;
  sessionStorage.setItem('fyc-availability', JSON.stringify(availability))
  const phone = data.chefNumber;
  const email = data.chefEmail;
  const slider = document.querySelector('.listing-slider');
  slider.innerHTML = `
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 1"></a>
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 3"></a>
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 2"></a>
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 4"></a>
                  `;
  

                  $('.listing-slider').slick({
                    centerMode: true,
                    centerPadding: '20%',
                    slidesToShow: 2,
                    responsive: [
                      {
                        breakpoint: 1367,
                        settings: {
                          centerPadding: '15%'
                        }
                      },
                      {
                        breakpoint: 1025,
                        settings: {
                          centerPadding: '0'
                        }
                      },
                      {
                        breakpoint: 767,
                        settings: {
                          centerPadding: '0',
                          slidesToShow: 1
                        }
                      }
                    ]
                  });
                  inlineCSS();
  const titlebarTitle = document.querySelector('.listing-titlebar-title');
  titlebarTitle.innerHTML = `
                          <div class="listing-titlebar-title">
                            <h2>${name}<span class="listing-tag">${category}</span></h2>
                            <span>
                              <a href="#listing-location" class="listing-address">
                                <i class="fa fa-map-marker"></i>
                                ${location}
                              </a>
                            </span>
                            <div class="star-rating" data-rating="5">
                              <div class="rating-counter"><a href="#listing-reviews">(31 reviews)</a></div>
                            </div>
                          </div>
  `;
  const listingOverview = document.querySelector('#listing-overview');
  listingOverview.innerHTML = `
  
                            <p>
                            ${overview}
                          </p>
                          <div class="clearfix"></div>

                          <h3 class="listing-desc-headline">Tags</h3>
                          <ul class="listing-features checkboxes margin-top-0">
                          </ul>
  `;
  const listingFeatures = document.querySelector('.listing-features');
  tags.forEach(tag => {
    listingFeatures.innerHTML += `<li>${tag}</li>`;
  })
  const hostedTitle = document.querySelector('.hosted-by-title');
  hostedTitle.innerHTML = `
                        <h4><span>Recipe by</span> <a href="pages-user-profile.html">${chefName}</a></h4>
                        <a href="pages-user-profile.html" class="hosted-by-avatar"><img src="" alt=""></a>
  `;
  const listingDetails = document.querySelector('.listing-details-sidebar');
  listingDetails.innerHTML = `
                          <li><i class="sl sl-icon-phone"></i>${phone}</li>
                          <li><i class="fa fa-envelope-o"></i> <a href="#">${email}</a></li>
  `;
  const dollarSign = document.querySelector('.bsf-left');
  dollarSign.innerHTML = `
                      <h4>Starting from $${price}</h4>
                      <div class="star-rating" data-rating="5">
                        <div class="rating-counter"></div>
                      </div>
  `;
}

const fetchRecipeReview = (id) => {
  const data = {
    recipeID : id
  }
  axios.get(`${baseURL}/reviews/${id}?page=1`, data).then( res => {
    const reviews = res.data.payload.data;
    popReviews(reviews);
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const popReviews = (reviews) => {
  const length = reviews.length;
  const review_count = document.querySelector('.pop-review-count');
  review_count.innerText = `(${length})`;
  const reviewBody = document.querySelector('.listing-reviews-body');
  reviews.forEach(review => {
    const image = review.reviewersImage;
    const name = review.reviewersName;
    const recipeImage = review.recipesImage[0];
    const comment = review.review;
    const stars = review.stars;
    const date = new Date(review.created);
    const year = date.getFullYear();
    const num = date.getMonth();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    const month = months[num];
    const formattedDate = `${month} ${year}`;
    reviewBody.innerHTML += `
            <li>
							<div class="avatar"><img src="${image}" alt="" /></div>
							<div class="comment-content"><div class="arrow-comment"></div>
								<div class="comment-by">${name}<i class="tip" data-tip-content="Person who left this review actually was a customer"></i> <span class="date">${formattedDate}</span>
									<div class="star-rating" data-rating="${stars}"></div>
								</div>
								<p>${comment}</p>
								
								<div class="review-images mfp-gallery-container">
									<a href="${recipeImage}" class="mfp-gallery"><img src="${recipeImage}" alt=""></a>
								</div>
								<a href="#" class="rate-review"><i class="sl sl-icon-like"></i> Helpful Review <span>12</span></a>
							</div>
						</li>
    `;
  })
}

const addReviewToDOM = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const name = userData.fullname;
  const image = userData.image;
  const date = new Date();
  const year = date.getFullYear();
  const num = date.getMonth();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  const month = months[num];
  const formattedDate = `${month} ${year}`;
  const review = document.querySelector('.review-area').value;
  const stars = 5;
  const recipeImage = document.querySelector('.uploadButton-input').value;
  const reviewBody = document.querySelector('.listing-reviews-body');
  reviewBody.innerHTML += `
  <li>
    <div class="avatar"><img src="${image}" alt="" /></div>
    <div class="comment-content"><div class="arrow-comment"></div>
      <div class="comment-by">${name}<i class="tip" data-tip-content="Person who left this review actually was a customer"></i> <span class="date">${formattedDate}</span>
        <div class="star-rating" data-rating="${stars}"></div>
      </div>
      <p>${review}</p>
      
      <div class="review-images mfp-gallery-container">
        <a href="${recipeImage}" class="mfp-gallery"><img src="${recipeImage}" alt=""></a>
      </div>
      <a href="#" class="rate-review"><i class="sl sl-icon-like"></i> Helpful Review <span>12</span></a>
    </div>
  </li>
  `;
}

const postReview = (e) => {
  e.preventDefault();
  const recipeID = localStorage.getItem('fyc-recipe-id');
  const token = localStorage.getItem('fyc-token');
  if (!token) {
    toastr.error("You need to be signed in to be able to drop a review");
  } else {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    let reviewersID = userData._id;
    const review = document.querySelector('.review-area').value;
    const stars = 5;
   
    const data = {
      reviewersID,
      recipeID,
      review,
      stars
    };
    console.log(data);
    axios.post(`${baseURL}/reviews`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      addReviewToDOM();
      toastr.success(res.data.payload.data.message);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
}

const bookmark = document.querySelector('.like-button');
if (bookmark) {
  bookmark.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fyc-token');
    if (token) {
      const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
      const bookmarkersID = userData._id;
      const recipeID = localStorage.getItem('fyc-recipe-id');
      const data = {
        bookmarkersID,
        recipeID
      }
      if (localStorage.getItem('fyc-bookmark-id') === null) {
        axios.post(`${baseURL}/bookmark`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then((res) => {
          console.log(res);
          toastr.success("Recipe bookmarked");
          localStorage.setItem('fyc-bookmark-id', res.data.payload.data._id);
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
  })
}

const popAvailability = () => {
  const availability = JSON.parse(sessionStorage.getItem('fyc-availability'));
  const weekDay = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const picker = document.querySelector('#date-picker').value;
  const date = new Date(picker).getDay();
  const day = weekDay[date];
  const daySlots = availability[day];
  const panel = document.querySelector('.panel-dropdown-scrollable');
  panel.innerHTML = '';
  // const display = document.querySelector('.final-display');
  let output;
  daySlots.forEach( time => {
    const id = time.id;
    if(time.startHours > 12) {
      time.startHours = time.startHours%12;
      output = `${time.startHours}:${time.startMinutes} pm - `;
    } else {
      output = `${time.startHours}:${time.startMinutes} am - `;
    }
    if(time.endHours > 12) {
      time.endHours = time.endHours%12;
      output += `${time.endHours}:${time.endMinutes} pm`;
    } else {
      output += `${time.endHours}:${time.endMinutes} am`;
    }
    panel.innerHTML += `									
    <!-- Time Slot -->
    <div class="time-slot">
      <input type="radio" name="time-slot" id="time-slot-1">
      <label for="time-slot-1">
        <strong id="${id}">${output}</strong>
        <span>1 slot available</span>
      </label>
    </div>
    `;
  });
}

const dropdown = document.querySelector('.panel-dropdown-content');
const dropPanel = document.querySelector('.panel-dropdown');
dropPanel.addEventListener('click', (e) => {
  e.preventDefault();
  dropdown.classList.remove('display-none');
})
dropdown.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.hasAttribute('for')) {
    const timing = e.target.children[0].innerText;
    document.querySelector('.final-display').innerText = timing;
    const id = e.target.children[0].id;
    console.log(id);
    dropdown.classList.add('display-none');
    sessionStorage.setItem('fyc-book-id', id);
    close_panel_dropdown();
  }
})

$(".time-slot").each(function() {
	var timeSlot = $(this);
	$(this).find('input').on('change',function() {
		var timeSlotVal = timeSlot.find('strong').text();
    console.log(timeSlotVal);
		$('.panel-dropdown.time-slots-dropdown a').html(timeSlotVal);
		$('.panel-dropdown').removeClass('active');
	});
});

function close_panel_dropdown() {
  $('.panel-dropdown').removeClass("active");
  $('.fs-inner-container.content').removeClass("faded-out");
  }


const bookRecipe = (e) => {
  e.preventDefault();
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const bookersID = userData._id;
  const amount = document.querySelector('.qtyTotal').innerText;
  const slotID = sessionStorage.getItem('fyc-book-id');
  const recipeID = localStorage.getItem('fyc-recipe-id');
  const success_url = "http://www.thepottersmind.com/fyc/payment_success.html";
  const cancel_url = "http://www.thepottersmind.com/fyc/payment_failure.html";
  const data = {
    bookersID,
    recipeID,
    amount,
    slotID,
    success_url,
    cancel_url
  }
  console.log(data);
  axios.post(`${baseURL}/recipe/book`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const paymentID = res.data.payload.data.id;
    console.log(paymentID);
    var stripe = Stripe("pk_test_51I1DVaBUbM1BcmYudXugXJGteb66XL2NS7IMWHRDCLcNwWbwdOgJJD4b1hyo2DUaNgH4HxGn5RamRO4djeX4usXg00rM6sJg8k");
    return stripe.redirectToCheckout({ sessionId: paymentID });
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}
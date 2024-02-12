'use strict'

if (location.pathname === '/') index()

function index() {
  console.log('hi')
  const searchButton = document.querySelector('.index-search')

  searchButton.addEventListener('click', function (e) {
    e.preventDefault()
    console.log('clicked')
    window.location.assign('recipePage.html')
  })
}
if (location.pathname === '/recipePage.html') recipePage()

// ////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function recipePage() {
  let inputs = []
  let searchString
  let result
  let labelArray = []
  let linkArray = []
  let imgArray = []
  const imageContainer = document.querySelector('.image')
  const recipeContainer = document.querySelector('.display-recipes')
  const label = document.querySelector('.recipe-name')
  const nextRecipe = document.querySelector('.right')
  const prevRecipe = document.querySelector('.left')
  const ingredientForm = document.querySelector('.ingredient-form')
  let inputIngredient = document.querySelectorAll('.input-ingredient')
  const buttons = document.querySelectorAll('.button')
  const addbutton = document.querySelector('.add-button')
  const add = document.querySelector('.add')

  label.classList.add('hidden')
  buttons.forEach((button) => button.classList.add('hidden'))

  const clearContent = function () {
    imageContainer.replaceChildren()
    inputIngredient.value = ''
    inputs = []
    labelArray = []
    linkArray = []
    imgArray = []
  }

  const addItem = function () {
    addbutton.addEventListener('click', function () {
      add.insertAdjacentHTML(
        'beforebegin',
        ` <div class="form-row">
      <label class="label-ingredient">Ingredient</label>
      <input class="input-ingredient">
    </div>`
      )
      inputIngredient = document.querySelectorAll('.input-ingredient')
    })
  }
  addItem()

  const formSearch = function () {
    ingredientForm.addEventListener('submit', function (e) {
      e.preventDefault()
      clearContent()
      inputIngredient.forEach((x) => inputs.push(x.value))
      console.log(inputIngredient)
      searchString = inputs.reduce((acc, value) => acc + '%2C' + value)
      console.log(searchString)
      recipeContainer.classList.add('overlay')
      main()
    })
  }
  formSearch()

  const main = async function () {
    // const inputs2 = inputs.slice(1);

    async function recipesCall(searchstring) {
      const allRecipes = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${searchString}&app_id=9784895c&app_key=e65da9a1b654e72198722c6236dddae5&imageSize=LARGE`
      )
      const { hits: result } = await allRecipes.json()

      return result
    }

    result = await recipesCall(searchString)
    console.log(result)

    result.forEach((dish, i) => {
      const imgEl = document.createElement('img')

      imgEl.src = dish.recipe.images.LARGE.url
      imgEl.addEventListener('load', function () {
        imageContainer.appendChild(imgEl)
      })
      labelArray.push(dish.recipe.label)
      linkArray.push(dish.recipe.url)
      imgArray.push(imgEl)
    })

    const renderRecipe = function (i) {
      imgArray[i].style.display = 'block'
      label.innerHTML = `${labelArray[i]} <span>(Click here to view Recipe)</span>`
      label.setAttribute('href', linkArray[i])
    }

    const switchRecipes = function () {
      let displayedRecipe = 0
      renderRecipe(displayedRecipe)

      nextRecipe.addEventListener('click', function () {
        imgArray[displayedRecipe].style.display = 'none'
        if (displayedRecipe === imgArray.length - 1) {
          displayedRecipe = 0
        } else if (displayedRecipe < imgArray.length - 1) {
          displayedRecipe++
        }

        renderRecipe(displayedRecipe)
      })

      prevRecipe.addEventListener('click', function () {
        imgArray[displayedRecipe].style.display = 'none'
        if (displayedRecipe === 0) {
          displayedRecipe = imgArray.length - 1
        } else if (displayedRecipe > 0) {
          displayedRecipe--
        }

        renderRecipe(displayedRecipe)
      })
    }
    switchRecipes()
    label.classList.remove('hidden')
    buttons.forEach((button) => button.classList.remove('hidden'))
  }
}

// chicken%2Cpasta

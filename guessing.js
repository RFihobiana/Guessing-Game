class GameState {
    static newGame() {
        let s = new GameState()
        s.low = 0
        s.high = 100
        s.guess = null
        s.numGuesses = 0
        s.secret = s.randInt(s.low, s.high)
        return s
    }
    
    static fromStateObject(stateObject) {
        let s = new GameState()
        for(let key of Object.keys(stateObject)) s[key] = stateObject[key]
        return s
    }
    
    toURL() {
        let url = new URL(location)
        url.searchParams.set('l', this.low)
        url.searchParams.set('h', this.high)
        url.searchParams.set('g', this.guess)
        url.searchParams.set('n', this.numGuesses)
        return url.href
    }
    
    static fromURL(url) {
        let s = new GameState(), params = new URL(url).searchParams
        s.low = parseInt(params.get('l'))
        s.high = parseInt(params.get('h'))
        s.guess = parseInt(params.get('g'))
        s.numGuesses = parseInt(params.get('n'))
        
        if(isNaN(s.low) || isNaN(s.high) || isNaN(s.guess) || isNaN(s.numGuesses))
            return null
        
        s.secret = s.randInt(s.low, s.high)
        return s
    }
    
    randInt(min, max) {
        return Math.ceil(Math.random()*(max-min-1)) + min
    }
    
    render() {
        let input = document.querySelector('#input'),
            heading = document.querySelector('#heading'),
            range = document.querySelector('#range'),
            playagain = document.querySelector("#playagain")
        
        heading.textContent = document.title = `I'm thinking of number between ${this.low} and ${this.high}.`
        
        range.style.marginLeft = `${this.low}%`
        range.style.width = `${this.high-this.low}%`
        
        input.value = ''
        input.focus()
        
        if(this.guess === null) input.placeholder = 'Type your guess and hit Enter'
        else if(this.guess < this.secret) input.placeholder = `${this.guess} is too low. Guess again`
        else if(this.guess > this.secret) input.placeholder = `${this.guess} is too high. Guess again`
        else {
            input.placeholder = `${this.guess} is correct!`
            heading.textContent = `You win in ${this.numGuesses} guesses!`
            playagain.hidden = false
        }
    }
    
    updateForGuess(guess) {
        if(guess > this.low && guess < this.high) {
            if(guess < this.secret) this.low = guess
            else if (guess > this.secret) this.high = guess
            this.guess = guess 
            this.numGuesses++
            return true
        } else {
            alert(`Please, enter a number greater than ${this.low} and less than ${this.high}`)
            return false
        }
    }
}

let gamestate = (GameState.fromURL(window.location) || GameState.newGame())

history.replaceState(gamestate, '', gamestate.toURL())

gamestate.render()

document.querySelector('#input').addEventListener('change', event => {
    if(gamestate.updateForGuess(parseInt(event.target.value)))
        history.pushState(gamestate, '', gamestate.toURL())
    gamestate.render()
})

window.addEventListener('popstate', event => {
    gamestate = GameState.fromStateObject(event.state)
    gamestate.render()
})
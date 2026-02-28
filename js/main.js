const explanation = document.getElementById("explanation");
const nextButton = document.getElementById("nextButton");
const optionButtons = document.getElementById("options").children;
const resetButton = document.getElementById("resetButton");

const correctSpan = document.getElementById("correct");
const completedSpan = document.getElementById("completed")
const statement = document.getElementById("statement");
const facts = [
	{ statement: "typeof null === 'object'", answer: "true", explanation: "Old bug — null is primitive but typeof says 'object'." },
	{ statement: "NaN === NaN", answer: "false", explanation: "NaN is not equal to itself. Use isNaN() or Number.isNaN()." },
	{ statement: "0.1 + 0.2 === 0.3", answer: "false", explanation: "Floating point: actually 0.30000000000000004" },
	{ statement: "[] == ![]", answer: "true", explanation: "Both sides become 0 after coercion." },
	{ statement: "[] == false", answer: "true", explanation: "[] becomes '' → 0, false becomes 0." },
	{ statement: "undefined == null", answer: "true", explanation: "Loose equality makes them equal." },
	{ statement: "0 == '0'", answer: "true", explanation: "String '0' becomes number 0." },
	{ statement: "true + true === 2", answer: "true", explanation: "true becomes 1 → 1 + 1 = 2." },
	{ statement: "typeof NaN === 'number'", answer: "true", explanation: "NaN is a number type." },
	// { statement: "typeof (() => {}) === 'function'", answer: "true", explanation: "Arrow functions are functions." },
	// { statement: "const arr = [1]; arr[1] === undefined", answer: "true", explanation: "Missing index returns undefined." },
	// { statement: "'hello'[1] === 'e'", answer: "true", explanation: "Strings can use bracket notation." },
	// { statement: "({}).toString() === '[object Object]'", answer: "true", explanation: "Default object toString result." },
	// { statement: "function f() { console.log(x); var x = 5; } f() // logs undefined", answer: "true", explanation: "var is hoisted, value stays undefined." },
	// { statement: "let x = 1; let x = 2; // error", answer: "true", explanation: "let does not allow redeclaration." },
	// { statement: "Array.isArray([]) === true", answer: "true", explanation: "Best way to check if something is an array." },
	// { statement: "[] instanceof Array === false", answer: "false", explanation: "Usually true, but can fail across frames." },
	// { statement: "0 === -0", answer: "true", explanation: "+0 and -0 are equal with strict equality." },
	// { statement: "Object.is(0, -0) === true", answer: "false", explanation: "Object.is treats +0 and -0 as different." },
	// { statement: "typeof Symbol() === 'symbol'", answer: "true", explanation: "Symbol is a new primitive type (ES6)." },
	// { statement: "'a' in { a: 1 } === false", answer: "false", explanation: "in returns true for own properties." },
	// { statement: "{ a: 1 }.hasOwnProperty('toString') === true", answer: "false", explanation: "toString comes from prototype, not own." },
	// { statement: "const { x } = { x: 1 }; x === 1", answer: "true", explanation: "Object destructuring (ES6)." },
	// { statement: "const f = (a = 10) => a; f() === 10", answer: "true", explanation: "Default parameter value (ES6)." },
	// { statement: "let [a, b] = [1]; b === undefined", answer: "true", explanation: "Array destructuring fills missing items with undefined." },
	// { statement: "`hello ${1 + 1}` === 'hello 2'", answer: "true", explanation: "Template literals with interpolation (ES6)." },
	// { statement: "class Person { name = 'Alex' } new Person().name === 'Alex'", answer: "true", explanation: "Class fields (ES2022, widely supported)." },
	// { statement: "await Promise.resolve(42) === 42", answer: "true", explanation: "await gets the resolved value (ES2017)." },
	// { statement: "Symbol('id') === Symbol('id')", answer: "false", explanation: "Every Symbol is unique." },
	// { statement: "Object.isFrozen({}) === true", answer: "false", explanation: "Normal objects are not frozen." }
];
const shuffledFacts = facts.sort(() => Math.random() - 0.5);
// Animation for fading in statement, explanations and feedback
const ExplanationAnimation = [
	{ opacity: 0, },
	{ opacity: 1 }
];
// Timing for the explanation animation
const ExplanationTiming = {
	duration: 300,
	easing: "cubic-bezier(0.4, 0, 0.2, 1)",
	fill: "forwards"
};


const hide = (element) => element.classList.add("hidden");
const show = (element) => element.classList.remove("hidden");
const disable = (button) => button.toggleAttribute('disabled', true);
const enable = (button) => button.toggleAttribute('disabled', false);

let correct = 0;
let completed = 0;
let fact;


const resetQuiz = () => {
	hide(resetButton);
	getNextFact();
	correctSpan.textContent = 0;
	completedSpan.textContent = 0;
	completed = 0;
	correct = 0;
}

function getNextFact() {
	fact = shuffledFacts.shift();
	statement.textContent = fact.statement;
	statement.animate(ExplanationAnimation, ExplanationTiming);
	hide(explanation);

	for (let option of optionButtons) {
		option.classList.remove("correct");
		option.classList.remove("incorrect");
		enable(option);
	}

	disable(nextButton);
}


nextButton.addEventListener("click", getNextFact);
resetButton.addEventListener("click", resetQuiz);

for (let option of optionButtons) {
	option.addEventListener("click", e => {
		for (let button of optionButtons) {
			disable(button);
		}

		if (facts.length !== completed) {
			enable(nextButton);
		} else {
			show(resetButton);
			statement.textContent = "No more questions! ";

			if (correct === completed) {
				statement.textContent += "Perfect score! Excellent!";
			} else if (correct / completed >= 0.9) {
				statement.textContent += `Excellent! You scored ${correct} out of ${completed}`;
			} else if (correct / completed >= 0.8) {
				statement.textContent += `Great job! You scored ${correct} out of ${completed}`;
			} else if (correct / completed >= 0.5) {
				statement.textContent += `Not bad! You scored ${correct} out of ${completed}`;
			} else {
				statement.textContent += `Better luck next time! You scored ${correct} out of ${completed}`;
			}
		}



		const guess = e.target.value;
		if (guess === fact.answer) {
			e.target.animate(ExplanationAnimation, ExplanationTiming);
			e.target.classList.add("correct");
			correct += 1;

			const scoreThresholds = [
				{ min: 24, color: "white", size: "2.5rem" },
				{ min: 20, color: "crimson", size: "2rem" },
				{ min: 15, color: "goldenrod", size: "1.8rem" },
				{ min: 10, color: "darkgreen", size: "1.5rem" },
				{ min: 5, color: "LightGoldenrodYellow", size: "1.2rem" },
				{ min: 0, color: "white", size: "1rem" }
			];

			const threshold = scoreThresholds.find(t => correct >= t.min);

			if (threshold) {
				score.style.color = threshold.color;
				score.style.fontSize = threshold.size;
				score.setAttribute("aria-live", "polite");
				score.animate(ExplanationAnimation, ExplanationTiming);
			}
		} else {
			e.target.animate(ExplanationAnimation, ExplanationTiming);
			e.target.classList.add("incorrect");
		}

		explanation.textContent = fact.explanation;
		explanation.animate(ExplanationAnimation, ExplanationTiming);
		show(explanation);
		completed += 1;
		document.getElementById("correct").textContent = correct;
		document.getElementById("completed").textContent = completed;

	})
}
getNextFact();

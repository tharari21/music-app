## Steps to Start React Project

1. Go to folder where you want react app code to live.
   ```bash
       mkdir <folder_name>
       cd <folder_name>
   ```
2. Run `npm create vite@latest` and give project a name and select React project with Javascript
3. Run `npm install` to install dependencies from Node Package Manager (npm)
4. Run `npm run dev` to start React server locally

## How React Works

- `index.html` file is the file that is served to the browser when React server is running
- `src/main.jsx` is going to insert the root React component into the div with `id` of `root` inside `index.html`. Specifically it's going to insert the `App` component found in `src/App.jsx`
- In React, there are only React components which is what we use to build User Interface (UI). A React Component is simply a Node function that returns a JSX Element.

## React/Javascript Events

- Click Event

```javascript
// a simple button component that logs to the console "User clicked button!" when button is clicked
const Button = () => {
  // Can pass event optionally. Only add it if needed. Generally won't need it for click handlers
  const handleClick = () => {
    console.log("User clicked button!");
  };
  return <button onClick={handleClick}>Click me</button>;
};
```

- Submit Event

```javascript
// a simple form component that logs to the console "User submitted form!" when form is submitted
const Form = () => {
  // event is optional. Will definitely need it on submit events to prevent the page from refreshing
  const handleSubmit = (event) => {
    // Will prevent page from refreshing which is the default html behavior and we want to avoid it in react
    e.preventDefault();
    console.log("User submitted form!");
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Enter Text: </label>
      <input type="text" />
    </form>
  );
};
```

- Change Event

```javascript
// a simple input component that logs to the console whatever the user types into keyboard when they press any keys
const Input = () => {
  // event is optional. Will definitely need it on change events to get text from the input that user typed
  const handleChange = (event) => {
    // event.target.value contains the text of the input in a change event
    console.log(event.target.value);
  };
  return <input type="text" onChange={handleChange} />;
};
```

## Destructuring

### Objects

```javascript
// store value "Tomer" into variable firstName
const {
  name: { firstName },
} = {
  name: { firstName: "Tomer", lastName: "Harari" },
};
console.log(firstName); // prints "Tomer"

// For destructuring to work with an object you must use the right name of the keys or it won't work
const {
  name: { somethingElse },
} = {
  name: { firstName: "Tomer", lastName: "Harari" },
};
console.log(somethingElse); // somethingElse will be undefined because the key "somethingElse" does not exist in the object's name key

// can destructure in function parameters too
const myFunc = ({ a, b, c }) => {};
const obj = { a: "A value", b: "B value", c: "C value" };
myFunc(obj);
myFunc({ a: 1, b: 2, c: 3 });
```

### Arrays

```javascript
const todoList = [1, 2, 3, 4, 5];

// stores the first element into the variable "firstValue"
const [firstValue] = todoList;
console.log(one); // 1

// stores the first element (value 1) into the variable "firstValue", the second element (value 2) into "secondValue" and third element (value 3)
const [firstValue, secondValue, thirdValue] = todoList;
console.log(thirdValue); // 3

// can do this if you only want a value towards the middle/end
const [, , , , val] = todoList;
console.log(val); // 5
```

## Spread Operator

### Objects

```javascript
const obj1 = { a: 1, b: 2 };
// spreads obj1 inside of obj2 and adds another key,value pair
const obj2 = { ...obj1, c: 3 }; // obj2 is now {a: 1, b: 2, c: 3}

const myObj = { a: 1, b: 2, c: 3 };
// destructuring and spreading
const { a, ...theRest } = myObj;

console.log(a); // a contains the value 1
console.log(theRest); // theRest is an object containing {b: 2, c: 3}
```

### Arrays

```javascript
const arr1 = [1, 2, 3, 4];
// spreads values of arr1 into arr2 and adds 5,6,7
const arr2 = [...arr1, 5, 6, 7];

console.log(arr1); // [1,2,3,4] - arr1 does not change.
console.log(arr2); // [1,2,3,4,5,6,7]
```

## Props

Props are simply parameters you can pass down to components.
A parent component can pass props to child components.
Props can be anything - it can be an object, array, number, string, even a function can be passed as props

```javascript
const ParentComponent = () => {
  return <ChildComponent value={25} />;
};

// ChildComponent simply displays the value that is passed by its parent. In this example value will be 25 so the screen displays 25
const ChildComponent = ({ value }) => {
  return <p>{value}</p>;
};
```

## React Hooks

React has many hooks that allows us to do really cool stuff. There are many hooks in react and you can even create your own hooks which we'll see later on

### State

State is simply a way for us to keep track of a value in react.
We need React to know about our values so React can store it in its memory.

In the following example I want to show you why we need state.

```javascript
/*
This component creates a regular javascript variable called value and sets it to 0
Then it simply displays a button and the value of count which will start at 0
We create an onClick handler to increment the count value. We expect that when button is clicked for value to increase
If you put this code into react you'll see something strange happen
When you the button, the count value does not update. It remains at 0.
*/
const Component = () => {
  const count = 0;

  const handleClick = () => {
    count++;
  };
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment Value!</button>
    </>
  );
};
```

As we saw above, regular javascript variables don't work well with react if you want react to display the updated value on the screen. Let's see how we can do it the right way

```javascript
import { useState } from "react";
// This component uses react's useState hook instead. This is the right way to keep track of a value in react.
const Component = () => {
  // We set the initial value to 0 by passing 0 into useState().
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment Value!</button>
    </>
  );
};
```

So why don't regular javascript variables update the count on the screen but useState() does?

To understand this you need to understand the word "render"
When React places components onto the browser screen, this is known as "rendering". React "renders" each component you define onto the browser page.
When the user first loads the website in the browser, react does the "initial render" which is the first render of each component in your app
When we used the javascript variable for count, what happened was that the value of the count updated but React did not "re-render" the component. If a value changes, react needs to re-render the component so that the value can update on the screen. For React to do this "re-render" it needs to know about your variable and whether it changed. We use useState so that react knows about the value changing. This is why we use the setter function to update the value, because the setter function has built in functionality of re-rendering the component when value changes.


## Oauth


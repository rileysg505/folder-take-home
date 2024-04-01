# Rocket Lab Take Home Assginment


## Instruction to run the project

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Functionality

The application initally displays the application, which consists of three main parts - the search, the create button, and the tree itself. Any property that has a value over 10 is highlighted in green text.
<img width="1285" alt="Screenshot 2024-04-01 at 12 50 34 AM" src="https://github.com/rileysg505/folder-take-home/assets/59489097/ee79a98d-dee2-47bb-95e6-96c563e56eaf">


### Assumptions
Going into this project we must assume a few things
1. The user is unable to create a node more than one level deep. For example, if I only have `Rocket/` as my node, the user cannot create `Rocket/Child1/Grandchild`. Instead, the user must first create `Rocket/Child1` then `Rocket/Child1/Grandchild1`
2. Searching should only be for node paths and not for properties. This is because we assume that the same property can exist for multiple different layers. For example, `Engine1` exists both on `Stage1` and `Stage2`, so it is sumpler to implement using just the node paths instead.
3. To mock HTTP services, we use asynchronous functions using a delay of 1000ms

   
#### Searching
Searching a path in the search bar will display any data of the path, including children nodes.
For this project, I went under the assumption that the user is only searching for exact paths, fuzzy searching was out of the scope for this project

An example, whee you search `Rocket/Stage1` it will return the expected values, but search something like `Stage1` or `Rocket/Stage` will not return anything except the tree at the root node.

To handle the ability to cancel inflight requests, I used Observable in RxJs, along with implementing a debounce time to limit the requests made

#### Creating a new node

Clicking on the create button will have a modal pop up. This modal is a form that will allow the user to select which parent node they want to add a new node or property to. Clicking create will update the inital tree.

<img width="506" alt="Screenshot 2024-04-01 at 12 50 57 AM" src="https://github.com/rileysg505/folder-take-home/assets/59489097/ab7737f4-b87d-4845-9894-c5d59c2392a7">
<img width="505" alt="Screenshot 2024-04-01 at 12 50 50 AM" src="https://github.com/rileysg505/folder-take-home/assets/59489097/e4c93c0e-b54e-46db-82d5-16fde1fd99b0">

#### Reusable Dialog
The Confirmation Modal component is a component used primarily for a Delete Confirmation Modal, however, I made sure to have the modal itself be as reusable as possible, allowing the user to change the title,content, and actions of the component. 

#### Pipe
The created at date displays the data in relative to our current time. To make sure it stays updated while running, we have the Pipe automatically rerun every minute to keep that data updated. It says the days, hours, and minutes that have passed since the node was created
#### Testing
I used the built in testing for Angular to check if values over 10 is green

### Tool/Language/Framework
This project was created using Angular and Typescript

Tailwind CSS was imported to avoid the need of extra css files, taking a utility-first approach and to keep consistency. More benefits of tailwind can be read [here](https://www.material-tailwind.com/blog/7-reasons-why-you-should-use-tailwind-css)

Angualar Material UI Library was used to speed up development time and maintain a simple and elegant UI design.

### Challenges
The biggest challenge of this project was learning how to develop a frontend application using Angular. Most, if not all, of my professional experience is with using React, and switching to a much more verbose and robust framework had a steep learning curve. Along with this, many examples that I had researched had different version of Angular, so there may be some inconsistency with the current standards. 

Learning dependency injection was both hard and familiar. It felt a lot like using Redux Toolkit and using slices, but it felt more consistent. The service that seemed very difficult for me was finding a way to mock using an HTTP service. Because of this, I decided to use observables in the `data-access-service.ts` with a delay to simulate the async behavior

RxJS and Observables were extremely difficult for me to understand, as I've only worked with promises in the past. However, I believed Observables were the best choice, as one of the requirements was to be able to cancel inflight requests, and you are unable to do that with promises. Wrapping my head around subscriptions and Subjects was extremely difficult and the syntax may be a little inconsistent, but I was able to have a better understanding of of they work 

### Potential Downfalls

This implementation heavily relies on Angular Material. Since this is a smalelr project, that is okay, but for larger projects I would like to use custom styling or another component library, since Angular Material is not as customizable

Due to being new with the observables and subscriptions, I am not sure if I completely unsubscribed to all of them correctly, so there may be potential memory leaks. However, this problem would be mitigated with more practice over time and another technique I learned (mentioned below)

### Production Environment Changes

The most important thing I would change in a production environment is using the Async Pipe. Unfortunately, I only found out about deep into the project, and did not have the extra time to implement it. I would prefer to use it, as it is a safer way to handle asynchronous data, as it automatically unsubscribes when the component unmounts.

Along with this, I would write many more tests in production. The scope of this project only asked for one test, but I would make more in production. Also, I would like to use a more test driven development approach, instead of writing tests after implementation.

A general improvement would also be to have someone who knows Angular review the code. As someone who mainly is experienced in React and jsx, I want to make sure I am consistent with the standards and how to structure the code. Some of the ways I implemented my logic may be more familiar to React patterns, but the logic was still able to transfer over.

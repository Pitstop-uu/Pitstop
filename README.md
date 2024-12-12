## Getting Started

This application is run with Next.js.

First, make sure to clone the git repository to your local machine:

https://github.com/Pitstop-uu/Pitstop.git 

Second, install the dependencies:

```bash
npm install
```

Third, create a build of the application:
```bash
npm run build
```

Finally, run the server:

```bash
npm run start
```

If you are unable to create a build, you can run a development server instead:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use Pitstop

Upon opening the web application, you are located at the homepage, where you can navigate to one of the three data visualization pages; [Constructor Standings](#ConstructorStandings), [Driver Standings](#DriverStandings), and [Fastest Laps](#FastestLaps). On the homepage there is some information about Pitstop, as well as a preview of an interactable Constructor Standings line chart. You can access any of the pages you wish to view through the header or at the bottom of the homepage.

### [Constructor Standings](#ConstructorStandings)

The constructor standings page visualizes the standings of the [constructors](#constructors) within the [Constructors' Championship](#constructors-championship) throughout the history of Formula 1. 

#### Filter Options
The application provides a range of filter options to customize the data displayed in the graph. These accessible via buttons locatied on the top left of the interface:

1. Timeframe Selection:
    * The button labeled *TIMEFRAME: 2020-2024* reflects the constructors progression within the selected time interval, displayed in the graph below. 
    * Clicking this button opens a dropdown menu. Select *TIMEFRAME: 2020-2024* to adjust the interval to any range between 1958 and 2024. The graph updates to reflect your chosen timeframe. 

2. Selection Method:
    * Pressing the *SELECTION METHOD: INTERVAL* button toggles the selection method between *INTERVAL* and *SPECIFIC* 
    * In *INTERVAL* mode, the graph displays constructors progression over a range of years.A
    * In *SPECIFIC* mode, the graph highlights constructors performance during a single year, detailing results for individual circuits (race tracks).

3. Constructor Selection:
    * The *SELECT CONSTRUCTORS: ALL* button allows you to refine the data by selecting  pecific constructors.
    * Clicking this button opens a list of constructors relevant to the chosen timeframe or year. Select specific constructors to focus on their data. Leaving all constructors unselected displays results for all constructors.

#### Features within the Linechart
The linechart includes several interactive features to enhance data exploration:
* Tooltip: Hovering over the graph displays a tooltip, showing the constructor standings for the selected year or circuit.
* Tooltip Highlight: Hovering over a constructor's line emphasizes their data, displaying all results for that constructor within the chosen timeframe. 

#### Predictions
The application includes a feature to display predictions for future performance (2025):

1. Ensure the *SELECTION METHOD

To access predictions (2025), have the *SELECTION METHOD: INTERVAL* active, with a timeframe *FROM* (1958-2023) and *TO* (2024) set. The *SHOW PREDICTIONS* button should pop-up. By pressing the button, the predicted results for 2025 is shown. You can also freely change timeframe (*FROM* (1958-2023)) and selection of constructors.

#### Constructor Standings Demo Tasks:

---
Task 1:

The current top constructors are Ferrari, McLaren, Mercedes and Red Bull. Set the time frame to 1998-2024 and then select the mentioned top constructors as well as Alpine in the constructor filter. Also, enable the predictions (click on 'SHOW PREDICTIONS'). Now, the line chart presents all of the teams that has won the Constructors' Championship since 1998. Try to answer the following questions:
- Look at who won the 2024 season. What year did they last win prior to 2024?
- What team do you think has been most dominant within the timeframe?
- Do you think the predictions for 2025 are reasonable based on the history?
---
Task 2:

The current "bottom" constructors are Alpine, Aston Martin, Haas, Kick Sauber, RB and Williams. Set the timeframe to 2015-2023 and select the mentioned "bottom" constructors in the constructor filter. Notice how Kick Sauber and RB have different names when the last year is set to 2023. 
- What was Kick Sauber called 2023?
- What was RB called 2023?

---
Task 3:

The two previous tasks looked at a time interval. Now it is time to look at a single year. In the timeframe filter, click on "SELECTION METHOD" to change the filter type from interval to specific. Then, select the year 2024. Notice how the x-axis shows the locations for 2024 instead of the years selected. 
-  At which location did McLaren take the lead in the Constructors' Championship? 
- It did not go very well for all of the teams. At what location did Kick Sauber gain their first points, and how many points did they finish with?

---

### [Driver Standings](#DriverStandings)

#### Driver Standings Demo Tasks:

---
Task 1:

The Driver Standings are very similar to the Constructor Standings. However, this page utilizes bar chart rather than a line chart. Select the timeframe 2020-2024. In the driver filter, select ALL of the drivers.
- What two persons has won a driver championship in the selected interval? 
- Based on the trends, who do you think will win the Driver's Championship 2025?
---
Task 2: 

The sport has had some controversial moments. Change the selection method of the timeframe from interval to specific, and choose the year 1994. This final of the drivers' championship was determined by a crash (https://www.youtube.com/watch?v=91JoW4mSiZo). Crashing in the sport can often lead to the need of retiring a car, which means no points can be gained.
- Who was involved in the crash?
- Can you see why the leader of the driver's championship would gain an advantage by crashing into the driver in the second place?
---

### [Fastest Laps](#FastestLaps)

## Glossary

### Formula 1
Formula 1 (F1) represents the highest tier of international single-seated motorsport racing, and is regarded as the peak of motorsport due to its technical excellence and intense pace. Although there are 20 drivers competing for the Grand Prix all over the world, it really is a team sport where 10 constructors (teams), with two driver seats each, attempt to engineer the fastest cars, develop the smartest strategy, and hire the most skilled pilots to push the performance to the absolute limit to win the championship.

Getting into watching and following Formula 1 and comprehending all of its aspects for the first time can be overwhelming due to everything that is taking place simultaneously both on and off track. Since the first championship occurred back in 1950, there is a substantial amount of history behind the sport. For newcomers, or curious fans, exploring the data and statistics such as past race results, championship outcomes, and driver performances can be incredibly beneficial to gain insights. Notably, there also exists Fantasy F1, which several users across the world play in, trying to predict possible winners in different race tracks. Having a web application which allows the users to easily compare and ultimately draw conclusions, can help the user in this regard.

As of now, there is available data on the official F1 website, presenting historical data. However, this data is all presented in tables, which may not be very pleasant to interact with and might make it challenging for the user to understand and make comparisons. Further, the filtering alternatives are very limited, and there is no possibility to make direct comparisons between different Formula 1 seasons.

### Pitstop
*Pitstop - a brief but critical pause during a race where a car is serviced by its team, typically for tire changes, aerodynamic adjustments, or minor repairs. Pitstops are a key strategic element, often influencing race outcomes.*

This web application facilitates the process and enhances the experience of viewing data and statistics regarding Formula 1. The objective is to provide functionality to visualize and compare results between years, tracks, drivers and teams, so both newcomers and seasoned fans may find it easier to make predictions and understand how the history of the sport can affect the present-day championships.

In more detail, the web application provides functionality of visualizing a timeline of the standings for specific Formula 1 constructors to see whether they are improving, worsening or remaining the same in terms of performance compared to other teams over time. In some cases, Formula 1 teams may also change names, or are only present during a period of time, which we have solved by mapping together the teams according to their name changes. Another functionality which the application provides, is to compare the fastest lap time per specific race track for a given driver, making it possible to compare and see if previous records are broken and what drivers are particularly good on a certain track. Lastly, the web application presents the driver standings over time, visualizing in a way for the user to easily compare between different seasons. 

The application also consists of the functionality of viewing what predictions a neural network model have made based on previous year's data. Currently, this functionality is present on the Constructor Standings page and Fastest Laps page when looking at a time interval ending in 2024.

### [Constructors](#constructors)
In Formula 1, a "Constructor" refers to the team that designs, builds, and enters a car in the championship. Unlike most sports, where teams are primarily about the players or athletes, F1 teams—constructors—are deeply involved in engineering and innovation. A constructor must create both the chassis (the car's body and structure) and choose or develop the engine that powers it.

Each constructor fields two cars driven by two different drivers. Big names like Ferrari, Mercedes, and Red Bull Racing are famous constructors, competing not only to win individual races but also for the prestigious Constructors' Championship. This title is awarded to the team that scores the most points across the season, based on the combined results of their two cars.

Constructors play a key role in shaping the sport, as their technological advancements and strategies often determine success. Unlike drivers who can change teams, constructors remain consistent entities, striving to design the fastest and most reliable cars. It’s a unique blend of sport and engineering prowess that sets Formula 1 apart.

### Championships
In Formula 1, "Championships" are the ultimate prizes awarded at the end of the season, recognizing excellence in two key categories: drivers and teams.

The Drivers' Championship is awarded to the individual driver who scores the most points over the season. Points are earned based on finishing positions in each race, with first place getting the most. Legendary drivers like Michael Schumacher, Lewis Hamilton, and Max Verstappen are celebrated for winning multiple championships, marking them as some of the best in the sport's history.

The Constructors' Championship goes to the team (or constructor) whose two cars accumulate the highest combined points across the season. This championship highlights the importance of teamwork, innovation, and consistency, as it recognizes the efforts of engineers, mechanics, and strategists behind the scenes.

Both championships run concurrently, and while a driver’s success is often more visible, the Constructors' Championship is equally coveted, showcasing the technological and strategic prowess of F1 teams. Together, these championships embody the blend of individual brilliance and team effort that defines Formula 1.

### Grand Prix
In Formula 1, a "Grand Prix" is a single race within the championship season. The term, which means "Grand Prize" in French, reflects the prestigious and high-stakes nature of these events.

Each Grand Prix takes place over a weekend, typically consisting of practice sessions, a qualifying session to determine the starting order, and the main race. Drivers and teams compete to finish as high as possible to earn points that count toward the Drivers' and Constructors' Championships.

Grand Prix races are held all over the world, on circuits that showcase diverse challenges, from the high-speed straights of Monza to the tight corners of the Monaco street circuit. The length of each race is standardized to around 300 kilometers (about 186 miles), ensuring a balance of speed, endurance, and strategy.

In our Fastest Laps page, the correct term for the "Grand Prix" filter would be "Location". However, in the database the locations are called Grand Prix, and we chose to follow the naming convention to avoid confusion when developing the application.
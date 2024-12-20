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
    * In *INTERVAL* mode, the graph displays constructors progression over a range of years.
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

1. Ensure the *SELECTION METHOD* is set to *INTERVAL*.
2. Set the timeframe *FROM (1958-2023)* and *TO* (2024).
3. The *SHOW PREDICTIONS* button will appear.
4. Press this button to view the predicted results for 2025.
5. You can adjust the timeframe *(FROM (1958-2023))* and constructor selection freely to refine the prediction view. 


By using these features, you can efficiently explore historical data, compare constructors and assess future projections.

### [Driver Standings](#DriverStandings)

The driver standings page visualizes the standings similar to the [constructors standings page](#ConstructorStandings), but for the drivers.

#### Filter Options
The application provides a range of filter options to customize the data displayed in the graph. These accessible via buttons locatied on the top left of the interface:

1. Timeframe Selection:
    * The button labeled *TIMEFRAME: 2020-2024* reflects the drivers progression within the selected time interval, displayed in a barchart below. 
    * Clicking this button opens a dropdown menu. Select *TIMEFRAME: 2020-2024* to adjust the interval to any range between 1950 and 2024. The barchart updates to reflect your chosen timeframe. 

2. Selection Method:
    * Pressing the *SELECTION METHOD: INTERVAL* button toggles the selection method between *INTERVAL* and *SPECIFIC* 
    * In *INTERVAL* mode, the barchart displays drivers progression over a range of years. 
    * In *SPECIFIC* mode, the linechart highlights drivers performance during a single year, detailing results for individual circuits (race tracks).

3. Driver Selection:
    * The *SELECT DRIVERS: NONE* button allows you to refine the data by selecting specific drivers. Note that you need to select at least one driver for the graph to visualise.
    * Clicking this button opens a list of drivers relevant to the chosen timeframe or year. Select specific drivers to focus on their data.

#### Features within the Linechart & Barchart
The linechart includes several interactive features to enhance data exploration:
* Tooltip: Hovering over the graph displays a tooltip, showing the driver standings for the selected year or circuit.
* Tooltip Highlight: Hovering over a drivers's line/bar emphasizes their data, displaying all results for that driver within the chosen timeframe. 

#### Predictions
NOTE: The application does not include any feature to display predictions for future performance (2025)

By using these features, you can efficiently explore historical data and compare drivers.

### [Fastest Laps](#FastestLaps)
The fastest laps page visualizes the fastest laps set by drivers throughout the history of Formula 1. 

#### Filter Options
The application provides a range of filter options to customize the data displayed in the graph. These accessible via buttons locatied on the top left of the interface:

1. Timeframe Selection:
    * The button labeled *TIMEFRAME: 2020-2024* reflects the fastest laps progression within the selected time interval, displayed in the graph below. 
    * Clicking this button opens a dropdown menu. Select *TIMEFRAME: 2020-2024* to adjust the interval to any range between 1950 and 2024. The graph updates to reflect your chosen timeframe. 

2. Selection Method (Timeframe):
    * Pressing the *SELECTION METHOD: INTERVAL* button toggles the selection method between *INTERVAL* and *SPECIFIC* 
    * In *INTERVAL* mode, the graph displays fastest laps progression over a range of years.
    * In *SPECIFIC* mode, the graph highlights fastest laps performance during a single year, detailing results for individual circuits (race tracks).

3. Grand Prix Selection:
    * The *SELECT GRAND PRIX:* button allows you to refine the data by selecting specific grand prix.
    * Clicking this button opens a list of grand prix relevant to the chosen timeframe or year. Select a specific grand prix to focus on their data.

4. Driver Selection:
    * The *SELECT DRIVERS: NONE* button allows you to refine the data by selecting specific drivers. Note that you need to select at least one driver for the graph to visualise.
    * Clicking this button opens a list of drivers relevant to the chosen timeframe or year. Select specific drivers to focus on their data.

5. Selection Method (Drivers):
    * Pressing the *SELECTION METHOD: SPECIFIC DRIVERS* button toggles the selection method between *SPECIFIC DRIVERS* and *RECORDS*
    * In *SPECIFIC DRIVERS* mode, the graph displays a barchart for the fastest laps progression over a range of years or during a single year.
    * In *RECORDS* mode, the graph displays a linechart for the record for the fastest laps performance overall over a range of years or during a single year.
 

#### Features within the Linechart
The linechart includes several interactive features to enhance data exploration:
* Tooltip: Hovering over the graph displays a tooltip, showing the constructor standings for the selected year or circuit.
* Tooltip Highlight: Hovering over a constructor's line emphasizes their data, displaying all results for that constructor within the chosen timeframe. 

#### Predictions
The application includes a feature to display predictions for future performance (2025):

1. Set the timeframe *TO* (2024) or *YEAR: 2024*.
2. The *SHOW PREDICTIONS* button will appear.
3. Select a Grand Prix in the *SELECT GRAND PRIX:*.
4. Press this button to view the predicted results for 2025.


By using these features, you can efficiently explore historical data, compare fastest laps times and records, in addition with future projections.

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
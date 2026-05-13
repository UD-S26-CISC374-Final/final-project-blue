# Linkin' Chickin

## Elevator Pitch

An outcast blue chick goes on an adventure to find his mother hen, Mama. Using linked list logic to connect each platform, it's up to you to traverse, insert, and delete platforms to help Baby Blue!

## Influences (Brief)

- *Duck Life*:
  - *Game series about raising a duck to be a champion in a sport.*
  - Sprite animations
- *[The Master's Pupil](https://store.steampowered.com/app/2082320/The_Masters_Pupil/)*:
  - *Game set in the eyes (literally) of artist Claude Monet.*
  - Painting art style.
- *Animal Crossing*:
  - *Game series about building a cozy island from the ground up.*
  - Music and overall "vibe"

## Core Gameplay Mechanics (Brief)

- Jump to platforms by solving platform-connection problems (related to linked lists)
- Delete platforms with threats to eliminate them and reach the platforms that you need.
- Incorrect platform connections or falling off the map lead to injury, enough of which can lead to death (replaying the level)
- Correctly connect platforms to ensure that the chick can jump to them AND reach his end goal.
- Traverse the platforms using buttons/input commands and delete dangerous spiky platforms to advance.
- View how your moves correspond to real code in an on-screen box.

# Learning Aspects

## Learning Domains

C++ and Linked Lists

## Target Audiences

* Intermediate-level programmers with understanding of C++, who are starting to learn data structures and linked lists.

## Target Contexts

* This would be assigned as a supplementary learning material for a student enrolled in C++ or Data Structures courses.

## Learning Objectives

- By the end of the lesson, players will be able to, when given a linked list, sequence pointer assignments for insertion, deletion, and traversal.
- By the end of the lesson, players will be able to perform necessary actions to remove, add, and travel through doubly linked lists.
- By the end of the lesson, players will be able to, when given a linked list, identify how incorrect assignments cause loss of references or broken lists.
After completing the game, the player will demonstrate:
- The ability to traverse, delete nodes, and insert nodes in linked lists.
- The ability to visualize the loss of reference nodes or creation of a broken list when traversing linked lists.

## Prerequisite Knowledge

- Prior to the game, the player needs the ability to code in C++ and demonstrate basic coding capabilities, including datatypes, variables, loops, and other basic coding knowledge.
- Prior to the game, the player needs to demonstrate knowledge of the structure of a node, including the "next" and "prev" fields.
- Prior to the game, the player needs to demonstrate basic knowledge of pointers.

## Assessment Measures

A short pre-test and matching post-test (where the data numbers are randomized each time) should be designed to assess student learning.

- Given data, create nodes including the data and arrange them in the provided order using ->next fields.
- Given the nodes and a sequence of ->next and ->prev, traverse the list and find the data that it points to.
- Choose one data point and delete it from the linked list. Choose a new point and insert it into the linked list.

The following is an example of the assessment.

A Node class is defined as the following:

```cpp
class Node {
    int data;
    Node* next = NULL;
    Node* prev = NULL;
};
```

The following list:

```text
H -> [12, 7, 25, 3, 18, 5] -> T
```

contains nodes. Each number shown is their data, stored in a pointer called "node<data>". For example, 12 is the data of node12, where node12 is a pointer.

- Given the nodes with data of 7, 5, 3, 18, 25, and 12, fill in each node's "prev" and "next" field to arrange them in the order presented in the list above.

```cpp
node12->next = node7;
node7->next = node25;
node25->next = node3;
node3->next = node18;
node18->next = node5;
```

```cpp
node7->prev = node12;
node25->prev = node7;
node3->prev = node25;
node18->prev = node3;
node5->prev = node18;
```

- From the now ordered linked list, insert the node with data of 14 between the nodes with data 25 and 3. Assume the data of 14 is stored in a node `node14` with `node14.prev = NULL` and `node14.next = NULL`.

```cpp
node14->next = node3;
node14->prev = node25;
node25->next = node14;
node3->prev = node14;
```

- Delete the node with data of 5.

```cpp
node18->next = NULL;
delete(node5);
```

- Traverse the list and print each node in the order provided in (1).

```cpp
Node* temp = node12;

while (temp != NULL) {
    cout << temp->data << " ";
    temp = temp->next;
}
```

# What sets this project apart?

- This project explains the traversal of a linked list to a player - a concept that is hard to visualize with static imagery and words alone.
- This project also allows the player to understand the loss of reference points or result in a broken list if incorrect platforms are connected to previous ones, which is much harder to do in code alone.
- This game also allows the player to use chained commands to connect nodes and try different strategies to appropriately connect nodes by providing visuals.
- This game allows the player to have to complete the ordering of nodes or platforms, hurting players for guessing and ensuring they have reasoning behind their connections.

# Player Interaction Patterns and Modes

## Player Interaction Pattern
Linkin' Chickin is a single-player game. Only one player is involved at once. They will use the keyboard to make connections between platforms, progress the player, and go through cutscenes.

## Player Modes

- *Player Menu*: Consisting of a 'Click to Play' button, the player can click the button to view the story before the level begins.
- *Cutscenes*: There is no active gameplay or learning in these scenes - they are pictures with a caption of dialogue under them to progress the story by pressing the spacebar.
- *Gameplay*: Single-player gameplay where you advance through the level based on performance according to the rules. There are three total stages with 3-4 levels in them each until the end.

# Gameplay Objectives

- *Connect the platforms*:
  - Use "next" and "prev" to connect the platforms and move forward or backward on the screen.
  - *Learn how to insert and traverse through nodes in a linked list and visualize how ->next and ->prev work, even when chained.*

- *Jump to different platforms to progress after connecting them*:
  - Use proper node connection to go to different platforms and reach the end platform from the start.
  - *Learn how a pointer traverses through a linked list.*

- *Remove hazards*:
  - Delete the nodes with spikes that prevent you from landing safely and find your way through mazes of platforms.
  - *Learn how to delete nodes in a linked list.*

- *Advance through levels*:
  - Successfully make it to the end of the level by landing on the last platform.
  - *Complete varying difficulty levels of the concept at hand.*

- *Advance through stages*:
  - Successfully complete 3-4 levels with increasingly difficult connection puzzles.
  - *Complete learning a concept related to linked lists.*

# Procedures/Actions
- The player can use the arrow keys to move Baby Blue across different platforms, which works only when platforms are connected.
- The player can type linked-list-related commands into a text box to connect various nodes (platforms)
- The player can delete or insert new platforms depending on their availability and the stage.

# Rules

- The player has a text box at the bottom of the screen. They use this box to enter commands that connect various platforms across the level. Helpful tips will be given in the first level of each stage.
- They player uses arrow keys to move the main character around the level and uses them to jump from platform to platform.
- The player must use ->next or ->prev to connect platforms before jumping, showcasing how linked lists function without proper connections.
- Players must reach the end objective (listed at the upper left of the screen) to complete the level. It can range from collecting items to simply reaching a platform.


# Objects/Entities

- Main Character (Baby Blue) and their features - including their movement and their healthbar.
- On-screen text box for commands
- On-screen buttons for commands
- Platforms.
- Trina Saurus tips and tricks during the stage.
- Announcements. (You win, You lose, Stage Complete, etc.)
- Buttons (Click to Play, etc.)

## Core Gameplay Mechanics (Detailed)

- Use a command in a textbox or click buttons appropriately to connect various nodes (platforms) as one connects data in a linked list with ->next and ->prev fields.
- Jump to platforms with arrow keys by solving platform-connection problems (related to linked lists). Traverse a linked list path and choose which platform is next based on which nodes (platforms) are connected to the current node.
- Use your knowledge of deleting nodes in linked lists and their connections (links) to link platforms to avoid spiky, dangerous platforms.
- Incorrect platform connections and falling off the map lead to injury, enough of which can lead to a level restart ("Game Over").
- Traverse the platforms using buttons and delete dangerous spiky platforms to advance. Cross platforms via Previous and Next nodes respectively. Delete dangerous, spiky platforms (ones that would not connect via links) in order to advance past them to more suitable and correctly sequential platforms.
- Players can view a small box on the screen to understand the actual code behind their operations.
- Arrows appear to direct attention to connections (they disappear in stage 3).

    
## Feedback
**Short Term Feedback**
**VISUAL**
- The player is rewarded with "Connection Made!" in green when they make a proper, meaningful connection. Likewise, they recieve a red "Invalid Input!" when the command is not valid.
- For most levels, a dinosaur spirit leads the player and assists them with proper commands and rules for the level. They also provide compliments for a stressless environment.
- Each level has the stage and level name on the upper left, so the player is fully aware of their progress.
- Players have a victorious sound play when they finish a level, paired with a congratulatory message.

**AUDIO**
- The main character will make a chirping sound when they get hurt, signaling that the player made a mistake, paired with a decreasing healthbar.
- A victorious sound will play on level completion.
- The background music for each level features a soft song.

**ANIMATION**
- Baby Blue jumps from one platform to another and can walk around on platforms.

**Long Term Feedback**
- A level and stage counter will inform the player of their progression through the game.
- Based on the stage, the environment changes, informing players that they are onto a new concept.
- When you win the game, you get a more detailed cutscene where Baby Blue finds his Mama and therefore completing the quest.
- A new concept is taught with each stage.

# Story and Gameplay

## Presentation of Rules

- As a chicken, Baby Blue is bound to have a dinosaur ancestral spirit. This spirit guides Blue throughout the game on different ways to connect platforms and also how to jump from one platform to another.
- When players make a correct connection, they get a "Connection Made!" alert in green, representing that the rules were followed to create a proper link. Otherwise, players will get a red "Invalid Command!" alert.
- At times, rules will be embedded into the background to assist players on their journey.
- When a proper input is given, arrows will point towards the connected platform.

## Presentation of Content

- Players will receive tutorials from a dinosaur spirit (see **Presentation of Rules**).
- Since the concept at hand is linked lists, each node is a platform, whose data can be plain, with spikes, or with items. This will be a visual detail that the player is expected to grasp through the tutorial.
- The player will have a text box on the bottom right that allows them to enter different node connections to connect platforms. Furthermore, players will have hints written on walls.
- Each platform is labelled with the format "node*" - where * is a number. This pair is expected to be used to code into the text box.
- Overall, knowledge components build up as they are presented to players by the dinosaur spirit.


## Story (Brief)

Mama is a lovely mother hen who has taken care of many babies over years in the barn. She anxiously awaits her new chick's arrival... only to find out that he's blue! Baby Blue is often outcast by his coopmates and therefore closer to Mama, who teaches him strength and kindness. One day, Mama is taken away from the farm to be turned into chicken tenders. The coop accepts it as a part of life, but Baby Blue and his trustworthy ancestor's spirit, Trina Saurus, make it their mission to find Mama.

## Storyboarding
(Not here yet)

# Assets Needed

## Aesthetics

Linkin' Chickin is meant to have a very cozy, comfortable art style to give players a calming atmosphere. The graphics are hand-drawn with paint brushes, making the environment feel like a painting.


## Graphical

- Characters List
  - *Baby Blue* - Main protagonist, controlled by player.
  - *Trina Saurus Rex* - Guide to assist player during levels by providing hints and tutorial.
  - *Mama* - The mother hen that Baby Blue attempts to save.

- Textures:
  - *Characters* - Characters are in a painted, gouache, comic art style
  - *Cutscenes* - Non-animated scenes of cartoons in gouache
  - *Environment* - Varies based on stage. Stage 1 is in a barn, stage 2 is in a plains/forest area, and stage 3 is in the city.
  - SEE **STORYBOARDING** FOR VISUAL DETAILS!

- Environment Art/Textures:
  - Each stage has its own background as you approach your destination - from the within a barn, to a vast valley outside of it, to a city.
  - The platforms are designed based on their stage - for example, hay platforms in the barn stage, grass platforms in the valley, and brick platforms in the city

## Audio

- Music List (Ambient sound)
  - *Story*: [Lud and Schlatt's Musical Emporium - Ludwig's Lullaby](https://youtu.be/kIQS15N5qYQ?si=xXjXFNbwLzA-9-rW)
  - *Story - The Motivational Bit*: [Kuukiko - Sunrise of Youth](https://youtu.be/MC_rB594VsM?si=NEL8W2QYgpPQfuUy). Please note - only half (0:36-1:13) of this song was used.
  - *Stage 1*: [Lud and Schlatt's Musical Emporium - Sunset Pier](https://youtu.be/nvFyOpBv2Bs?si=2-OIEzdfDmCVLj9T)
  - *Stage 2*: [Lud and Schlatt's Musical Emporium - 2 PM](https://youtu.be/nvFyOpBv2Bs?si=Cue2WaFwa_g1Ot_b)
  - *Stage 3*: [Lud and Schlatt's Musical Emporium - We Shop Theme](https://youtu.be/Y-6Plfn1yHg?si=1dA8ZvFe9t_ZKpmB)
  [View the Creative Commons License here.](https://creativecommons.org/licenses/by/3.0/)
  
- Sound List (SFX)
  - *Main Menu/Options Select* (Clicking Play/Options/Quit/Menu): [Beep](https://pixabay.com/sound-effects/film-special-effects-game-start-317318/)
  - *Taking damage* [Tiny, pitiful chirps](https://pixabay.com/sound-effects/nature-short-chick-sound-171389/)

# Metadata

* Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
* Version 0.0.3

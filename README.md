# Linkin' Chickin

## Elevator Pitch

An outcast blue baby chick goes on an adventure to find his mother hen, Mama. Using linked list logic to connect each platform, it's up to you to traverse, insert, and delete platforms to help Baby Blue!


## Influences (Brief)

- [*Shadow Fighter*](https://www.youtube.com/watch?v=CTHdMReN_9I&list=PLGtZwVE-T07sgNHY4O-rWxXGvv_iazHaA):
  - *Video game with Player vs PC action fighting (Mobile)*
  - The combat animations, environment design, and shadow-silhouette character designs.
- [*Ronin: Turn-Based Action Platformer*](https://www.youtube.com/watch?v=zLmbeogBfqU):
  - *Video game with Player vs PC turn-based fighting*
  - Turn-based combat and action, level design with platforms, and overall "feel" of the game.

## Core Gameplay Mechanics (Brief)

- Jump to platforms by solving platform-connection problems (related to linked lists)
- Incorrect platform connections and not-so-stealthy encounters lead to injury, enough of which can lead to death (replaying the level)
- Correctly connect platforms to ensure that the shinobi can jump to them AND reach his end goal.
- Traverse the platforms using buttons and delete dangerous spiky platforms to advance.
- Fight boss battles to test your knowledge against the clock
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

- Prior to the game, the player needs the ability to code in C++ and demonstrate basic coding capabilities, including datatypes, varibles, loops, and other basic coding knowledge.
- Prior to the game, the player needs to demonstrate knowledge of the structure of a node, including the .next and .prev fields.

## Assessment Measures
A short pre-test and matching post-test (where the data numbers are randomized each time) should be designed to assess student learning.
- Given data, create nodes including the data and arranging them in the provided order using .next fields.
- Given the nodes and a sequence of .next and .prev, traverse the list and find the data that it points to.
- Choose one data point and delete it from the linked list. Choose a new point and insert it into the linked list.

The following is an example of the assessment -
A Node class is defined as the following -
class Node {
  data: int;
  next : NULL;
  prev: NULL
}
The following list - H-[12, 7, 25, 3, 18, 5] -T - contains nodes. Each number shown is their data, stored in a pointer called "node<data>". For example, 12 is the data of node12, where node12 is a pointer.

- Given the nodes with data of 7, 5, 3, 18, 25, 12 , Fill in each node's .prev and .next field to arrange them in the order presented in the list above.
`
node12->next = node7;
node7->next = node25;
node25->next = node3;
node3->next = node18;
node18->next = node5;
`
`
node7->prev = node12;
node25->prev = node7;
node3->prev = node25;
node18->prev = node3;
node5->prev = node18;
`


- From the now ordered linked list, insert the node with data of 14 between the nodes with data 25 and 3. Assume the data of 14 is stored in a node 'node' with .prev = NULL and .next = NULL.
`
node14->next = node3;
node14->prev = node25;
node25->next = node14;
node3->prev = node14;
`

- Delete the node with data of 5.
`
node18->next = NULL;
delete(node5);
`

- Traverse the list and print each node in the order provided in (1).
`
Node* temp=node12;
while (temp!=NULL){
  cout<< temp->data<<" ";
  temp = temp->next;
}
`


# What sets this project apart?

- This project explains the traversal of a linked list to a player - a concept that is hard to visualize with static imagery and words alone.
- This project also allows the player to understand the loss of reference points or result in a broken list if incorrect platforms are connected to previous ones, which is much harder to do in code alone.
- This game also allows the player to use attacks that test how the players set up their nodes, ensuring that everything is connected to prevent punishment.
- This game allows the player to have to complete the ordering of nodes or platforms in a prompt manner in boss fights, testing the grasp of knowledge and reaction time.

# Player Interaction Patterns and Modes

## Player Interaction Pattern
The Last Shinobi is a single-player game. Only one player is involved at once. They will primarily use the mouse of a computer to make connections between platforms, progress the player, and click through options and cutscenes.

## Player Modes

- *Player Menu*: Consisting of a Quit, Play, and Options button, the player can click the buttons to close the game, play the game, and change the settings within the game respectively.
- *Cutscenes*: There is no active gameplay or learning in these scenes - they are mostly pictures with a caption of dialogue under them to progress the story.
- *Gameplay*: Single-player gameplay where you advance through the level based on performance according to the rules. There are seven total stages with 3-4 levels in them each until the end.

# Gameplay Objectives

- *Connect the platforms*:
    - Use your mouse to connect the "previous" and "next" field of each platform you stand on based on their symbol.
    - *Learn how to insert and delete nodes in a linked list and how .next and .prev work based on an address.*
- *Click "Next" and "Previous" to move through the level*:
    - Click the buttons to go to different platforms to go to the end of the level from the start.
    - *Learn how to traverse through a linked list.*
- *Defeat enemies*:
    - Click the attack button to fight enemies as long as your platforms are connected correctly.
    - *Provide a sense of achievement on wins, but punish mistakes when hurt*
- *Advance through levels*:
    - Successfully make it to the end of the level.
    - *Complete varying difficulty levels of the concept at hand.*
- *Advance through stages*:
    - Successfully complete 3-4 levels and defeat a timed boss battle related to the same topic.
    - *Complete learning a concept related to linked lists.*

# Procedures/Actions
- The player can click the "Next" button to move to the platform that is linked to the current platform's "next" field.
- The player can click the "Previous" button to move to the platform that is linked to the current platform's "previous" field.
- The player can click "Attack" to use their turn to fight an enemy. Combat will do damage to the opponent based on whether all the nodes appropriately lead to the opponent.
- The player can change the Next or Previous field of the platform by clicking on it and matching the correct symbol.

# Rules

- The player has a "Next", "Previous", "Attack" button at the bottom of the screen. They can use these to move the main character himself. The platforms will be numbered.
- Clicking on a platform will allow the player to "edit" its characteristics. Each platform will have a Japanese character on its left (previous address) and right (next address). The player has to click the proper character (left or right) and then click the correct  character (that of the .prev on the next platform) to connect the two. There will be multiple platforms, so connecting them will advance in difficulty. Each platform will have a number, indicating the data within the list.
- The player can only interact with the middle section of the screen. The screen has a left section (where the main character is standing), a middle section (whose platforms have editable properties) and the right section (whose platforms cannot be edited, but can be jumped to - this becomes the middle section after the previous platform is solved correctly).
Eventually, the previously mentioned "middle section" will get much larger, allowing players to move around and scroll through the level area, but make even more mistakes.
- Each move you make is recorded as actual code in a small box for the player's reference. The player, past stage 4, will be forced to type in these boxes to make moves.
- The player is not allowed to stay on the same platform at any point in the game, forcing them to move forward or backward depending upon the level design to prevent players from not making a decision. Some platforms will also be above or below them.
- If a platform is not assigned a .prev or a .next by accident, it will disappear. The player will have to find another route or restart the level.
- The player only gets the assistance of a "snake spirit" until the second stage as an introduction to the game. After that, they only get hints to a better performance on the death screen.
- The player will be given an Attack button to attack an opponent. Players are required to kill all enemies before proceding, and cannot do so by deleting their platform. Pressing Attack will execute a jumping sequence to the opponent, which will only go well if all the nodes are corrected.
- Players will learn through these steps to traverse a linked list. Furthermore, difficulty will be enhanced with an increasing number of nodes (platforms), and concepts including:
  - node deletion (removing a harmful platform)
  - doubly linked lists (in the first stage, the player can only move in one direction), 
  - circular linked lists (in a boss fight)
  - swap nodes (swap platforms to jump to)
  - and a few other medium-difficulty concepts.


# Objects/Entities

- Enemies and their movesets.
- Main Character and their movesets - including their special move, that can eliminate enemies at a range (does not appear until later), a healthbar.
- Bosses and their movesets.
- On-screen buttons for next, previous, and attack.
- On-screen timer for QTE and Boss Fights.
- Platforms.
- Menu box to edit platforms.
- Snake Spirit guide and text boxes.
- Announcements. (You win, You lose, Stage Complete, etc.)
- Buttons (Main screen, settings, quit, restart, etc.)

## Core Gameplay Mechanics (Detailed)

- Jump to platforms by solving platform-connection problems (related to linked lists). Traverse a linked list path and be able to choose which platform is next based on which nodes (platforms) are connected to the current node.
- Stealthily execute unaware opponents with action combos. Sneak up on opponents at different parts of the platforms if you perform the right node operations. Advancing to more difficult enemies leads you to a boss fight, which is similar in combat, but timed - you lose your turn if the timer runs out on your move. Use your knowledge of linked lists and their connections (links) to link platforms to avoid attacks. Answer questions in a limited amount of time, and finish the boss level to advance to the next topic.
- Incorrect platform connections and not-so-stealthy encounters lead to injury, enough of which can lead to death. As you connect platforms, choosing two in an incorrect order/sequence could cause damage to the health of your player. Additionally, failing to sneak up on opponents can lead to similar injury and loss of health. If player sustains enough damage, it will result in death, causing the player to have to restart the level.
- Traverse the platforms using buttons and delete dangerous spiky platforms to advance. Cross platforms via Previous and Next nodes respectively. Delete dangerous, spiky platforms (ones that would not connect via links) in order to advance past them to more suitable and correctly sequential platforms.
- Players can view and type in a small box on the screen to understand the actual code behind their operations.

    
## Feedback
**Short Term Feedback**
**VISUAL**
- The player is rewarded with an "Enemy Slain" popup when they kill a regular enemy. They will have an enemy counter to help them see how many they killed. Lastly, once all enemies are killed, they will have a "All enemies slain. Move forward." text popup.
- In the start of the game, the tutorial will be led by a snake spirit that will be very encouraging, saying things like "Good work, you made it to the next platform!" and rewarding the player for their moves. Around the fourth stage, when he fades away, he will reassure the player that they know the most important things to progress forward.
- The stages will be white screens with the stage name and title written on it, so the player is fully aware of their progress.
- On making too many mistakes, the player will die, recieving a black screen that gives them some words of advice based on the reason why they died.

**AUDIO**
- The main character will make a grunting sound when they get hurt, signaling that the player made a mistake, paired with a decreasing healthbar.
- A victorious sound will play on level completion.
- A single slash sound will play, paired with a black screen and a cry from the main character, signaling their death.

**ANIMATION**
- On landing on the last platform, the main character will look back at the level, nod, and walk forth to the next level.
- There will be one "empty area" that the player can run through - signaling a boss battle is incoming and that they are at the final stretch of the gameplay objective of that stage.

**Long Term Feedback**
- A level and stage counter will inform the player of their progression through the game.
- The players deaths (NOT injuries) will be counted to remind them only of continuous mistakes.
- When you win a stage, you get a cutscene into the next stage. When you win the game, you get a more detailed cutscene where the Last Shinobi meets his brother.
- If you make an incorrect connection, you will start at the beginning of the level. The player will recieve a blurb that appears on the top of the screen as to how the character got hurt.
- On completing levels, the player will recieve a congratulatory message.


# Story and Gameplay

## Presentation of Rules

- As a practitioner of Hebijutsu, The Last Shinobi is connected to his environment, specifically the nature of snakes. A snake spirit will provide helpful dialogue to assist the shinobi in his trials, especially in the beginning, that will disappear with time. This spirit is later revealed to be the Shinobi's brother's fighting spirit.
- When injured enough times to die, the player will be faced with a black death screen and the white silhouette of the last shinobi in his death animation. Depending on how the player failed (lost connection to a platform, died to a platform that should have been deleted, etc.), they will receive a helpful note surrounding the topic of the stage.

## Presentation of Content

- Players will receive a short tutorial from a snake spirit (see **Presentation of Rules**).
- Since the concept at hand is linked lists, each node is a platform, whose data can be plain, with an enemy, with spikes, or with power-ups. This will be a visual detail that the player is expected to grasp. Each platform will have a small Japanese character representing an "address" to the next or previous platform. This will teach players on how linked lists are formatted.
- The player will have buttons on-screen to move to the next platform ('.next'), to go back to a platform ('.prev'), and to commence an attack. If the player goes to the platform in the right sequence, they will be able to do a critical surprise attack, killing the enemy in few hits. However, if done incorrectly (for example, if they delete a platform they are standing on and end up falling onto the platform below them that contains an enemy), they will be punished by being attacked and recieving damage. Enough damage will kill the player and force them to start from the beginning of the level. This teaches core elements of linked lists, such as traversal, deletion, and insertion.
- Boss levels will have the same features, but the player is timed. The level will be set in a specific way that pose some concepts as puzzles (for example, the player will be expected to created a doubly linked list to travel backwards to dodge an incoming attack). Note that the player is not allowed to stay on the same platform at any point in the game.

## Story (Brief)

The Last Shinobi is one of the last disciples of Hebijutsu. The ninja, once given up to his training as a young boy, lost contact with his family, including the brother he once looked up to - a trained swordsman who returned from war with a strange illness. With all his hopes gone up in the flames along with his village, the shinobi recieves a secret letter from his brother, who now hides in a nearby village captured by their clan's greatest enemies. The news is devastating - his brother lies on his deathbed, with the last hope of seeing his brother once more before he rests. Determined, the shinobi prepares his sharpest sword for the greatest battle of his life - not just him against the strongest clan in ancient East Japon, but the force that kept him from his soulmate for far too long.

## Storyboarding

Main Title Screen with buttons
![Main Title Screen](/images/IMG_1057.jpeg)

Stage 1 Level 1 Example Layout
![Stage 1 Level Example](/images/IMG_1058.jpeg)

Example of a good node connection - clicking next results in a successful jump
![Good node connection example](/images/IMG_1060.jpeg)

Clicking the symbol allows you to edit the .next and .prev symbols. Since it's different, we want it to be the red-circled symbol so we go to the right platform (on the right).
![Menu to edit platform example](/images/IMG_1062.jpeg)

Example of a bad node connection - clicking next makes the shinobi fall into the abyss, taking damage, because that node isn't linked to our current platform.
![bad node 2 example](/images/IMG_1061.jpg)

Death screen example
![Death screen](/images/IMG_1063.jpeg)

Example of a good node connection to a platform with an unsuspecting enemy.
![Good node 2 example](/images/IMG_1064.jpeg)

Example of a "kill" and a comment from our Snake Spirit friend (only before stage 2)
![kill + snake spirit example](/images/IMG_1065.jpeg)


# Assets Needed

## Aesthetics

The Last Shinobi has an ancient Japanese-themed backstory, so its aesthetic will follow the same. The environment is calm and natural, but tense as you fight the enemies, especially the final boss of each stage. Paired with ambient music, the platforming aspects of the game will be more calm, encouraging players to focus on learning than just playing. 


## Graphical

- Characters List
  - *The Last Shinobi (Takeshi, but name does not appear outside of cutscenes)* - Main and only playable character that executes enemies, moves throughout the level, and leads the story. They are a shadow-like figure sporting a kasa (Japanese straw hat) and commonly seen clothing during the time in an attempt to blend in.
  - *Grunts (Unnamed)* - Main opponents, designed differently in art style based on the stage.
  - *Bosses* - Each boss is named after a Bushido virtue (way of the samurai). They will be shadow-like figures in traditional samurai headwear and clothing.
  - *Akio* - The Last Shinobi's brother, only appears in end cutscene. Frail and pale from his sickness, but happy to see his brother.

- Textures:
  - *Characters* - Characters will mostly be detailed but dark silhouettes.
  - *Cutscenes* - Anime cartoon-like art style/sketchbook-like graphics.
  - *Environment* - Slightly realistic and blurry as you go further, but strong and detailed the more close the plane is to the character. 
  - SEE **STORYBOARDING** FOR VISUAL DETAILS!

- Environment Art/Textures:
  - Each stage has its own background as you approach your destination - from the outskirts of your training grounds, a forest, village outskirts, village, and the final residence of the main boss.
  - The platforms are designed based on their stage - for example, a mud-and-grass platform in the forest versus a stone platform in the training grounds.
  - Some fire effects and particle effects will be added to items like torches and a few fire-based attacks.


## Audio

- Music List (Ambient sound)
  - *Main Screen/Death Screen*: [Bamboo Flute Music](https://youtu.be/kIQS15N5qYQ?si=xXjXFNbwLzA-9-rW)
  - *Boss Fights*: [Battle Music](https://youtu.be/E9kfzk0ei88?si=8dvjtMh9ynD3Q598)
  - *Mid-Level*: [Ambient Japanese Instrumental](https://www.youtube.com/watch?v=RWKnJn-gVxw&list=RDRWKnJn-gVxw&start_radio=1)
  
- Sound List (SFX)
  - *Attacks*: [Sword Slashes](https://www.youtube.com/watch?v=4bJI-e28kFg)
  - *New Stage*: [Sound Effect Music](https://www.youtube.com/watch?v=YOTDFFImDb0)
  - *Main Menu/Options Select* (Clicking Play/Options/Quit/Menu): [Slash](https://www.youtube.com/watch?v=aqXcGxcfUXQ)
  - *Jumping/Landing*: Short grunts and gasps (as heard in games like Temple Run). We intend to record these by ourselves!


# Metadata

* Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
* Version 0.0.3

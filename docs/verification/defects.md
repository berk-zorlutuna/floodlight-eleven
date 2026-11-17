## 5. Defects found and corrected during verification

The first full run on 17 November 2026 failed 7 cases. Four of the failures were defects in the game, which were corrected; the other three were errors in the test script. The results above are from the rerun after the fixes.

| Case | Finding | Kind | Correction |
| --- | --- | --- | --- |
| VC-14 | At free kicks, opponents were as close as 4.4 to the ball when it was kicked (required: 9.15). Set pieces were taken on a fixed timer, before players had walked back. | Software defect | Set pieces now wait until opponents are 9.15 away. After 2.5 s any player still too close is moved back. Players retreat at running pace. |
| VC-15 | At penalties, players were still inside the penalty area when the kick was taken. | Software defect | Same fix: penalties wait for the area and the arc to clear, and move any players still in them after 2.5 s. |
| VC-19 | A diving keeper could carry on up to 1.6 past the ball's line. He was driven toward the target at full speed and could not brake in time. | Software defect | Dive and shot-tracking speeds now taper with the remaining distance, so the keeper stops on the line of the ball. |
| VC-17 (found while writing it) | If a second card was shown within 2.5 s of a red card, the first sent-off player was left standing on the pitch. | Software defect | A new card now removes any player still waiting to leave. |
| VC-20 (found while writing it) | The receive assist turned off when the user kept holding the direction they had passed in — the most common case. | Software defect | The assist now stays on when the user pushes along the ball's path, and turns off only when pushing away from the ball and across its path. |
| VC-18 | The crossbar shot was aimed at the bar's underside, and the ball correctly went in. | Test error | The shot now meets the front of the bar. |
| VC-20 | After the assist was cancelled, the test measured several frames later, after the game's auto-switch had handed control to another player. | Test error | The test now checks the first frame after the cancel. |
| VC-23 | The free-slide measurement used a player who was not the controlled one. | Test error | The test player is made the controlled player first. |
| VC-25 | The test read the shoot button's label while the opponents had the ball, so it read SLIDE. | Test error | Buttons are now identified by their role, not their label. |

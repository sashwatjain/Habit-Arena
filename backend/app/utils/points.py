def calculate_points(habit_type: str, streak: int) -> int:
    """
    Calculate coin reward based on habit type and streak.
    - Good habits → positive points
    - Bad habits  → negative points
    - Streak increases reward
    """
    base_good = 10
    base_bad = -5

    if habit_type == "good":
        return base_good + (streak * 2)  # increasing reward
    else:
        return base_bad - (streak * 1)  # increasing penalty

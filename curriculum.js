/**
 * Code Explorer expanded beginner curriculum
 *
 * This module contains the new programs added after the original 54-example
 * collection. Keeping the curriculum data in a dedicated module makes the
 * larger library easier to review without mixing hundreds of Python lines into
 * the browser controllers in app.js.
 *
 * Every program is complete Python source that can be compiled independently.
 * Optional prepared input is stored beside the source so input examples run
 * deterministically without a server or an interactive terminal.
 */

/**
 * Creates one immutable curriculum record with a consistent metadata shape.
 *
 * @param {string} category Exact curriculum bucket shown in the vertical navigation.
 * @param {string} topic Short concept label displayed at the top of the card.
 * @param {string} level Beginner, Developing, or Guided Challenge difficulty.
 * @param {string} title Unique learner-facing program title.
 * @param {string} description One-sentence explanation of the learning purpose.
 * @param {string[]} views Workspace views that provide the strongest evidence.
 * @param {string} code Complete Python source placed into the editor.
 * @param {{inputs?: string, prerequisites?: string[], checkpointAfter?: string, expectedError?: string}} options Optional teaching metadata.
 * @returns {Readonly<object>} A frozen example record safe to merge with the original collection.
 */
function defineExample(category, topic, level, title, description, views, code, options = {}) {
  // Cloning arrays prevents later rendering code from mutating shared curriculum metadata.
  const prerequisites = Array.isArray(options.prerequisites)
    ? Object.freeze([...options.prerequisites])
    : undefined;
  // A frozen object makes accidental runtime edits fail instead of silently changing the catalog.
  return Object.freeze({
    category,
    topic,
    level,
    title,
    description,
    views: Object.freeze([...views]),
    code,
    ...(typeof options.inputs === "string" ? { inputs: options.inputs } : {}),
    ...(prerequisites ? { prerequisites } : {}),
    ...(options.checkpointAfter ? { checkpointAfter: options.checkpointAfter } : {}),
    ...(options.expectedError ? { expectedError: options.expectedError } : {}),
  });
}

/**
 * New focused lessons are grouped by curriculum section in reading order.
 * The original examples are merged in app.js and sorted with these records by
 * difficulty and source length, producing a gentle progression in every bucket.
 */
export const ADDITIONAL_EXAMPLES = Object.freeze([
  // FIRST STEPS: Ten tiny programs establish output, literals, and statement order.
  defineExample(
    "First Steps", "Output", "Beginner", "Hello, Python",
    "Run the smallest complete program and find its message in Console Output.",
    ["Story", "Coverage", "Console Output"],
    `print("Hello, Python!")`,
  ),
  defineExample(
    "First Steps", "Output values", "Beginner", "Print text and a number",
    "See print display different kinds of values in one readable line.",
    ["Story", "Before and After", "Console Output"],
    `print("Apples:", 4)`,
  ),
  defineExample(
    "First Steps", "Statement order", "Beginner", "Three steps in order",
    "Follow three statements from the first source line to the last.",
    ["Story", "Execution Path", "Coverage"],
    `print("First")
print("Second")
print("Third")`,
  ),
  defineExample(
    "First Steps", "Clear output", "Beginner", "Label every answer",
    "Compare unclear output with a labelled value that explains its meaning.",
    ["Story", "Console Output", "Coverage"],
    `print(12)
print("Score:", 12)`,
  ),
  defineExample(
    "First Steps", "Comments", "Beginner", "A comment for the reader",
    "Notice that a Python comment explains intent but does not execute as a step.",
    ["Story", "Execution Path", "Coverage"],
    `# This message welcomes the learner.
print("Welcome to Code Explorer")`,
  ),
  defineExample(
    "First Steps", "Literals", "Beginner", "Meet four literal values",
    "Print text, an integer, a decimal, and a Boolean value without variables.",
    ["Story", "Console Output", "Coverage"],
    `print("Python")
print(7)
print(2.5)
print(True)`,
  ),
  defineExample(
    "First Steps", "Expressions", "Beginner", "Calculate inside print",
    "Watch Python evaluate an arithmetic expression before displaying its result.",
    ["Story", "Before and After", "Console Output"],
    `print("Two plus three:", 2 + 3)
print("Four times five:", 4 * 5)`,
  ),
  defineExample(
    "First Steps", "Types", "Beginner", "Ask Python about a value",
    "Use type to discover the categories of three literal values.",
    ["Story", "Console Output", "Variables"],
    `print(type(10))
print(type(3.5))
print(type("ten"))`,
  ),
  defineExample(
    "First Steps", "Text repetition", "Beginner", "Repeat a text pattern",
    "See how multiplying a string creates a repeated piece of text.",
    ["Story", "Before and After", "Console Output"],
    `print("ha" * 3)
print("-" * 10)`,
  ),
  defineExample(
    "First Steps", "Program sequence", "Beginner", "A morning routine",
    "Read a small program from beginning to end and predict each output line.",
    ["Story", "Execution Path", "Coverage"],
    `print("Morning routine")
print("1. Wake up")
print("2. Drink water")
print("3. Practise Python")
print("Ready for the day")`,
  ),

  // VARIABLES AND TYPES: Six additions fill the gaps around assignment and conversion.
  defineExample(
    "Variables and Types", "Assignment", "Beginner", "Store one value",
    "Connect a descriptive name to a value and then print that value.",
    ["Story", "Variables", "Before and After"],
    `city = "Toronto"
print(city)`,
  ),
  defineExample(
    "Variables and Types", "Reassignment", "Beginner", "Change a variable",
    "Observe one name first reference one value and then a different value.",
    ["Before and After", "Variables", "Value History"],
    `score = 10
score = 15
print("Score:", score)`,
  ),
  defineExample(
    "Variables and Types", "Multiple assignment", "Beginner", "Create two names together",
    "Assign two related values on one line and inspect both names.",
    ["Story", "Variables", "Before and After"],
    `width, height = 8, 5
print("Width:", width)
print("Height:", height)`,
  ),
  defineExample(
    "Variables and Types", "Swapping", "Developing", "Swap two values",
    "Use tuple assignment to exchange values without a temporary variable.",
    ["Before and After", "Variables", "References"],
    `left = "red"
right = "blue"
left, right = right, left
print(left, right)`,
  ),
  defineExample(
    "Variables and Types", "None", "Beginner", "Reserve an empty result",
    "Use None to represent that a meaningful result has not been selected yet.",
    ["Story", "Variables", "Before and After"],
    `winner = None
print("Winner before the game:", winner)
winner = "Mina"
print("Winner after the game:", winner)`,
  ),
  defineExample(
    "Variables and Types", "Type conversion", "Developing", "Convert text into numbers",
    "Convert numeric text before using it in integer and decimal calculations.",
    ["Story", "Variables", "Before and After"],
    `whole_text = "12"
decimal_text = "2.5"
whole_number = int(whole_text)
decimal_number = float(decimal_text)
total = whole_number + decimal_number
print("Total:", total)`,
  ),

  // OPERATORS AND EXPRESSIONS: Nine additions cover Python's main operator families.
  defineExample(
    "Operators and Expressions", "Arithmetic", "Beginner", "Add and subtract",
    "Calculate money received, money spent, and the remaining amount.",
    ["Story", "Before and After", "Variables"],
    `received = 20
spent = 7
remaining = received - spent
print("Remaining:", remaining)`,
  ),
  defineExample(
    "Operators and Expressions", "Powers", "Beginner", "Multiply and raise a power",
    "Compare repeated multiplication with Python's exponent operator.",
    ["Story", "Variables", "Before and After"],
    `side = 4
area = side * side
power_area = side ** 2
print(area, power_area)`,
  ),
  defineExample(
    "Operators and Expressions", "Floor division", "Developing", "Pack complete boxes",
    "Use floor division to count full boxes and modulo to count leftovers.",
    ["Story", "Variables", "Before and After"],
    `items = 23
box_size = 5
full_boxes = items // box_size
left_over = items % box_size
print("Full boxes:", full_boxes)
print("Left over:", left_over)`,
  ),
  defineExample(
    "Operators and Expressions", "Comparisons", "Beginner", "Compare two scores",
    "Store the true or false results of greater-than and equality comparisons.",
    ["Story", "Variables", "Conditions"],
    `first_score = 18
second_score = 15
first_is_higher = first_score > second_score
scores_match = first_score == second_score
print(first_is_higher, scores_match)`,
  ),
  defineExample(
    "Operators and Expressions", "Precedence", "Developing", "Control calculation order",
    "Use parentheses to make the intended order of operations explicit.",
    ["Story", "Before and After", "Variables"],
    `without_parentheses = 2 + 3 * 4
with_parentheses = (2 + 3) * 4
print("Default order:", without_parentheses)
print("Grouped order:", with_parentheses)`,
  ),
  defineExample(
    "Operators and Expressions", "Logical and", "Developing", "Require two facts",
    "Combine two Boolean values when both requirements must be true.",
    ["Variables", "Before and After", "Conditions"],
    `has_ticket = True
is_on_time = True
can_enter = has_ticket and is_on_time
print("Can enter:", can_enter)`,
  ),
  defineExample(
    "Operators and Expressions", "Logical or", "Developing", "Accept either permission",
    "Combine two Boolean values when either permission is sufficient.",
    ["Variables", "Before and After", "Conditions"],
    `is_owner = False
is_editor = True
can_change_page = is_owner or is_editor
print("Can edit:", can_change_page)`,
  ),
  defineExample(
    "Operators and Expressions", "Logical not", "Developing", "Reverse a Boolean",
    "Use not to express the opposite of a stored Boolean state.",
    ["Variables", "Before and After", "Conditions"],
    `is_raining = False
is_dry = not is_raining
print("Dry outside:", is_dry)`,
  ),
  defineExample(
    "Operators and Expressions", "Membership", "Developing", "Check collection membership",
    "Use in and not in to ask whether values belong to a collection.",
    ["Story", "Structures", "Conditions"],
    `colors = ["red", "green", "blue"]
has_green = "green" in colors
missing_purple = "purple" not in colors
print(has_green, missing_purple)`,
  ),

  // STRINGS: Six additions progress from indexing to practical text processing.
  defineExample(
    "Strings", "Indexing", "Beginner", "Read characters by position",
    "Use positive and negative indexes to read characters from a word.",
    ["Story", "Structures", "Variables"],
    `word = "Python"
first = word[0]
last = word[-1]
print(first, last)`,
  ),
  defineExample(
    "Strings", "Slicing", "Developing", "Slice a word",
    "Select several characters at once with start and stop positions.",
    ["Story", "Structures", "Before and After"],
    `language = "Python"
start = language[:3]
ending = language[3:]
print(start, ending)`,
  ),
  defineExample(
    "Strings", "Length", "Beginner", "Measure a message",
    "Use len to count every character, including spaces.",
    ["Story", "Variables", "Before and After"],
    `message = "Learn Python"
character_count = len(message)
print("Characters:", character_count)`,
  ),
  defineExample(
    "Strings", "F-strings", "Developing", "Format a profile sentence",
    "Insert named values into a readable sentence with an f-string.",
    ["Story", "Variables", "Before and After"],
    `name = "Asha"
lessons = 6
message = f"{name} completed {lessons} lessons."
print(message)`,
  ),
  defineExample(
    "Strings", "Split and join", "Developing", "Rebuild a sentence",
    "Split text into words and join those words with a new separator.",
    ["Story", "Structures", "Before and After"],
    `sentence = "trace every value"
words = sentence.split()
label = " | ".join(words)
print(words)
print(label)`,
  ),
  defineExample(
    "Strings", "Text cleanup", "Developing", "Build initials",
    "Clean a full name, split it into parts, and build readable initials.",
    ["Story", "Structures", "Variables"],
    `full_name = "  maya ali  "
clean_name = full_name.strip().title()
parts = clean_name.split()
initials = parts[0][0] + parts[1][0]
print(clean_name)
print(initials)`,
  ),

  // DECISIONS: Five additions introduce common branching patterns before larger rules.
  defineExample(
    "Decisions", "Even or odd", "Beginner", "Classify a number",
    "Use a remainder to choose between two mutually exclusive messages.",
    ["Conditions", "Story", "Coverage"],
    `number = 14

if number % 2 == 0:
    result = "Even"
else:
    result = "Odd"

print(result)`,
  ),
  defineExample(
    "Decisions", "Three paths", "Developing", "Positive, zero, or negative",
    "Follow an if, elif, and else chain with exactly one selected path.",
    ["Conditions", "Coverage", "Execution Path"],
    `number = -4

if number > 0:
    label = "Positive"
elif number == 0:
    label = "Zero"
else:
    label = "Negative"

print(label)`,
  ),
  defineExample(
    "Decisions", "Chained comparison", "Developing", "Check a safe range",
    "Use one chained comparison to test a lower and upper boundary.",
    ["Conditions", "Story", "Coverage"],
    `temperature = 22

if 18 <= temperature <= 25:
    message = "Comfortable"
else:
    message = "Adjust the room"

print(message)`,
  ),
  defineExample(
    "Decisions", "Truthiness", "Developing", "Check an empty collection",
    "See how an empty list behaves as false in a condition.",
    ["Conditions", "Structures", "Coverage"],
    `tasks = []

if tasks:
    message = "Work remains"
else:
    message = "All tasks complete"

print(message)`,
  ),
  defineExample(
    "Decisions", "Pricing rules", "Guided Challenge", "Choose a ticket price",
    "Combine age bands and membership to calculate a final ticket price.",
    ["Conditions", "Before and After", "Coverage"],
    `age = 17
is_member = True

if age < 13:
    price = 6
elif age < 18:
    price = 9
else:
    price = 12

if is_member:
    price -= 2

print("Ticket price:", price)`,
  ),

  // LOOPS: Six additions cover iteration helpers, loop completion, and concise construction.
  defineExample(
    "Loops", "Range step", "Beginner", "Count by twos",
    "Use the third range argument to control the distance between loop values.",
    ["Loop Table", "Loop Lab", "Execution Path"],
    `for number in range(2, 11, 2):
    print(number)`,
  ),
  defineExample(
    "Loops", "Enumerate", "Developing", "Number a reading list",
    "Use enumerate to receive a position and value during each iteration.",
    ["Loop Table", "Variables", "Structures"],
    `books = ["Python Basics", "Clean Code", "Algorithms"]

for position, title in enumerate(books, start=1):
    print(position, title)`,
  ),
  defineExample(
    "Loops", "Dictionary iteration", "Developing", "Visit product prices",
    "Iterate through dictionary items and calculate a labelled price with tax.",
    ["Loop Table", "Structures", "Before and After"],
    `prices = {"Notebook": 5, "Pen": 2, "Folder": 4}
tax_rate = 0.13

for product, price in prices.items():
    price_with_tax = price * (1 + tax_rate)
    print(product, round(price_with_tax, 2))`,
  ),
  defineExample(
    "Loops", "Sentinel loop", "Developing", "Read until done",
    "Stop a prepared-input loop when a sentinel word announces completion.",
    ["Input Playground", "Loop Lab", "Conditions"],
    `entry = input("Task or done: ")
task_count = 0

while entry.lower() != "done":
    task_count += 1
    print("Saved:", entry)
    entry = input("Task or done: ")

print("Tasks saved:", task_count)`,
    { inputs: "Read chapter\nPractise loops\ndone" },
  ),
  defineExample(
    "Loops", "Loop else", "Guided Challenge", "Search with a loop else",
    "Use a loop else block when a search finishes without encountering break.",
    ["Execution Path", "Coverage", "Loop Table"],
    `values = [3, 8, 11, 14]
target = 10

for value in values:
    if value == target:
        print("Found", target)
        break
else:
    print(target, "was not found")`,
  ),
  defineExample(
    "Loops", "List comprehension", "Guided Challenge", "Build labels concisely",
    "Compare a compact list comprehension with the values it creates.",
    ["Story", "Structures", "Before and After"],
    `numbers = [1, 2, 3, 4, 5]
labels = [f"Item {number}" for number in numbers]
print(labels)`,
  ),

  // FUNCTIONS AND SCOPE: Eight additions build a path from a first call to nested helpers.
  defineExample(
    "Functions and Scope", "No parameters", "Beginner", "Define and call a greeting",
    "See that a function body waits until the function is called.",
    ["Function Journey", "Call Stack", "Story"],
    `def show_greeting():
    print("Welcome to Python")

show_greeting()`,
  ),
  defineExample(
    "Functions and Scope", "One parameter", "Beginner", "Pass a name into a function",
    "Follow an argument into a parameter and use it inside the function frame.",
    ["Function Journey", "Call Stack", "Variables"],
    `def greet(name):
    print("Hello", name)

greet("Noor")`,
  ),
  defineExample(
    "Functions and Scope", "Return values", "Developing", "Return instead of only printing",
    "Return a calculated value so the calling code can store and reuse it.",
    ["Function Journey", "Before and After", "Call Stack"],
    `def double(number):
    return number * 2

result = double(7)
print("Doubled:", result)`,
  ),
  defineExample(
    "Functions and Scope", "Keyword arguments", "Developing", "Name the supplied arguments",
    "Call a function with keyword arguments so each supplied value is self-explanatory.",
    ["Function Journey", "Variables", "Call Stack"],
    `def describe_pet(name, animal):
    return f"{name} is a {animal}."

message = describe_pet(animal="cat", name="Milo")
print(message)`,
  ),
  defineExample(
    "Functions and Scope", "Pure function", "Developing", "Calculate without changing outside state",
    "Use a function that depends only on its arguments and returns a new result.",
    ["Function Journey", "Before and After", "Variables"],
    `def price_with_tax(price, tax_rate):
    return price * (1 + tax_rate)

base_price = 20
final_price = price_with_tax(base_price, 0.13)
print("Base:", base_price)
print("Final:", round(final_price, 2))`,
  ),
  defineExample(
    "Functions and Scope", "Collection parameter", "Developing", "Average a list of values",
    "Pass a list into a function and return one summary value.",
    ["Function Journey", "Structures", "Call Stack"],
    `def calculate_average(values):
    total = sum(values)
    return total / len(values)

scores = [78, 84, 91, 87]
average = calculate_average(scores)
print("Average:", average)`,
  ),
  defineExample(
    "Functions and Scope", "Early return", "Guided Challenge", "Validate before calculating",
    "Return early for invalid input and keep the main calculation easy to read.",
    ["Function Journey", "Conditions", "Coverage"],
    `def safe_average(values):
    if not values:
        return None

    return sum(values) / len(values)

scores = []
average = safe_average(scores)

if average is None:
    print("No scores supplied")
else:
    print("Average:", average)`,
  ),
  defineExample(
    "Functions and Scope", "Nested helper", "Guided Challenge", "Use a private helper function",
    "Follow a nested helper that supports one larger formatting function.",
    ["Function Journey", "Call Stack", "Execution Path"],
    `def format_student(name, score):
    def result_label(value):
        if value >= 50:
            return "Pass"
        return "Try again"

    label = result_label(score)
    return f"{name}: {score} ({label})"

report = format_student("Ravi", 76)
print(report)`,
  ),

  // COLLECTIONS: Eight additions demonstrate safe access and practical container patterns.
  defineExample(
    "Collections", "List slicing", "Beginner", "Select part of a list",
    "Create a new list containing only the selected range of elements.",
    ["Structures", "References", "Before and After"],
    `numbers = [10, 20, 30, 40, 50]
middle = numbers[1:4]
print(middle)`,
  ),
  defineExample(
    "Collections", "Tuple records", "Developing", "Read a fixed coordinate record",
    "Store related fixed values in a tuple and unpack them into descriptive names.",
    ["Structures", "Variables", "Before and After"],
    `coordinate = (12, 8, "north")
x, y, direction = coordinate
print("Position:", x, y)
print("Direction:", direction)`,
  ),
  defineExample(
    "Collections", "Set operations", "Developing", "Find shared interests",
    "Use set intersection to keep only values present in both collections.",
    ["Structures", "Before and After", "Variables"],
    `maya_interests = {"Python", "music", "cycling"}
liam_interests = {"Python", "chess", "cycling"}
shared = maya_interests & liam_interests
print("Shared:", shared)`,
  ),
  defineExample(
    "Collections", "Safe dictionary access", "Beginner", "Use a default for a missing key",
    "Use dictionary get to supply a safe result when a key is absent.",
    ["Structures", "Story", "Before and After"],
    `profile = {"name": "Amina", "city": "Ottawa"}
language = profile.get("language", "Not provided")
print("Language:", language)`,
  ),
  defineExample(
    "Collections", "Dictionary items", "Developing", "Build a price report",
    "Visit each key and value pair while accumulating a complete total.",
    ["Loop Table", "Structures", "Variables"],
    `prices = {"Book": 12, "Pen": 2, "Bag": 25}
total = 0

for item, price in prices.items():
    total += price
    print(item, price)

print("Total:", total)`,
  ),
  defineExample(
    "Collections", "Dictionary comprehension", "Guided Challenge", "Index words by length",
    "Build a dictionary by transforming each word into a key and measured value.",
    ["Structures", "Before and After", "Story"],
    `words = ["loop", "function", "variable"]
lengths = {word: len(word) for word in words}
print(lengths)`,
  ),
  defineExample(
    "Collections", "Stack", "Developing", "Use a list as a stack",
    "Append and pop from one end to demonstrate last-in, first-out behavior.",
    ["Structures", "Mutation Explorer", "Value History"],
    `history = []
history.append("home")
history.append("lessons")
history.append("loops")
current = history.pop()
print("Current:", current)
print("Remaining:", history)`,
  ),
  defineExample(
    "Collections", "Queue", "Developing", "Use a list as a small queue",
    "Remove the earliest waiting item to demonstrate first-in, first-out behavior.",
    ["Structures", "Mutation Explorer", "Value History"],
    `waiting = ["Ari", "Bea", "Chen"]
first_person = waiting.pop(0)
print("Helping:", first_person)
print("Still waiting:", waiting)`,
  ),

  // REFERENCES AND MUTATION: Four additions contrast identity, copies, and side effects.
  defineExample(
    "References and Mutation", "Immutable values", "Beginner", "Reassign an integer",
    "Observe that updating one integer name does not change another integer name.",
    ["References", "Mutation Explorer", "Before and After"],
    `first = 10
second = first
second += 5
print("First:", first)
print("Second:", second)`,
  ),
  defineExample(
    "References and Mutation", "List copy", "Developing", "Copy before changing",
    "Compare an original list with a separate shallow copy changed afterward.",
    ["References", "Mutation Explorer", "Structures"],
    `original = ["red", "green"]
copied = original.copy()
copied.append("blue")
print("Original:", original)
print("Copied:", copied)`,
  ),
  defineExample(
    "References and Mutation", "Nested aliases", "Guided Challenge", "Share one nested list",
    "See two dictionaries reference the same nested list and observe one shared mutation.",
    ["References", "Mutation Explorer", "Structures"],
    `shared_tags = ["python"]
first_profile = {"name": "Ari", "tags": shared_tags}
second_profile = {"name": "Bea", "tags": shared_tags}
second_profile["tags"].append("beginner")
print(first_profile)
print(second_profile)`,
  ),
  defineExample(
    "References and Mutation", "Function side effect", "Guided Challenge", "Mutate a list in a function",
    "Follow one list reference into a function that changes the original object.",
    ["Function Journey", "References", "Mutation Explorer"],
    `def add_completed(tasks, task):
    tasks.append(task)

completed = []
add_completed(completed, "Variables lesson")
add_completed(completed, "Loops lesson")
print(completed)`,
  ),

  // INPUT, ERRORS AND DEBUGGING: Three additions model safe validation and exception handling.
  defineExample(
    "Input, Errors and Debugging", "Exception handling", "Developing", "Handle invalid number text",
    "Catch a conversion error and provide a clear fallback instead of stopping unexpectedly.",
    ["Input Playground", "Error Coach", "Coverage"],
    `raw_age = input("Age: ")

try:
    age = int(raw_age)
    print("Next year:", age + 1)
except ValueError:
    print("Please enter digits only")`,
    { inputs: "twelve" },
  ),
  defineExample(
    "Input, Errors and Debugging", "Input validation", "Developing", "Validate a menu choice",
    "Repeat a prompt until the prepared response matches an allowed option.",
    ["Input Playground", "Loop Lab", "Conditions"],
    `choice = input("Choose 1, 2, or 3: ")

while choice not in {"1", "2", "3"}:
    print("Invalid choice")
    choice = input("Choose 1, 2, or 3: ")

print("Selected:", choice)`,
    { inputs: "9\n2" },
  ),
  defineExample(
    "Input, Errors and Debugging", "Raise and catch", "Guided Challenge", "Reject an impossible quantity",
    "Raise a meaningful exception inside a function and handle it at the call site.",
    ["Error Coach", "Function Journey", "Execution Path"],
    `def calculate_total(price, quantity):
    if quantity < 0:
        raise ValueError("Quantity cannot be negative")
    return price * quantity

try:
    total = calculate_total(5, -2)
    print("Total:", total)
except ValueError as error:
    print("Could not calculate:", error)`,
  ),

  // CLASSES AND OBJECTS: Eight additions introduce object state in bounded steps.
  defineExample(
    "Classes and Objects", "First class", "Beginner", "Create a simple object",
    "Define a class, create one instance, and attach a beginner-friendly attribute.",
    ["Story", "Variables", "Structures"],
    `class Lamp:
    pass

desk_lamp = Lamp()
desk_lamp.color = "green"
print("Lamp color:", desk_lamp.color)`,
  ),
  defineExample(
    "Classes and Objects", "Constructor", "Developing", "Initialize an object",
    "Use __init__ to give every new book object a title and page count.",
    ["Function Journey", "Variables", "Structures"],
    `class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

book = Book("Python Basics", 240)
print(book.title, book.pages)`,
  ),
  defineExample(
    "Classes and Objects", "Instance method", "Developing", "Change object state with a method",
    "Call a method that updates one attribute on the existing object.",
    ["Function Journey", "Mutation Explorer", "Structures"],
    `class Counter:
    def __init__(self):
        self.value = 0

    def increase(self):
        self.value += 1

counter = Counter()
counter.increase()
counter.increase()
print(counter.value)`,
  ),
  defineExample(
    "Classes and Objects", "Multiple instances", "Developing", "Keep objects independent",
    "Create two objects from one class and verify that their attributes stay separate.",
    ["References", "Structures", "Variables"],
    `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

first = Student("Maya", 82)
second = Student("Leo", 91)
first.score += 5
print(first.name, first.score)
print(second.name, second.score)`,
  ),
  defineExample(
    "Classes and Objects", "Method return", "Developing", "Ask an object for a result",
    "Use an instance method to calculate and return information from object state.",
    ["Function Journey", "Structures", "Before and After"],
    `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

shape = Rectangle(6, 4)
print("Area:", shape.area())`,
  ),
  defineExample(
    "Classes and Objects", "Class attribute", "Guided Challenge", "Share a class-level value",
    "Compare one value shared by the class with values stored on each instance.",
    ["Structures", "References", "Variables"],
    `class Course:
    platform = "Code Explorer"

    def __init__(self, title):
        self.title = title

variables = Course("Variables")
loops = Course("Loops")
print(variables.platform, variables.title)
print(loops.platform, loops.title)`,
  ),
  defineExample(
    "Classes and Objects", "Inheritance", "Guided Challenge", "Extend a base class",
    "Inherit a shared method and add behavior that belongs to a more specific class.",
    ["Function Journey", "Call Stack", "Structures"],
    `class Animal:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"Animal: {self.name}"

class Dog(Animal):
    def speak(self):
        return "Woof"

pet = Dog("Milo")
print(pet.describe())
print(pet.speak())`,
  ),
  defineExample(
    "Classes and Objects", "Composition", "Guided Challenge", "Place one object inside another",
    "Build a library object that stores and reports information from book objects.",
    ["Structures", "References", "Function Journey"],
    `class Book:
    def __init__(self, title):
        self.title = title

class Library:
    def __init__(self, name):
        self.name = name
        self.books = []

    def add_book(self, book):
        self.books.append(book)

library = Library("Community Library")
library.add_book(Book("Python Basics"))
library.add_book(Book("Learning Loops"))
print(library.name)
print([book.title for book in library.books])`,
  ),

  // GUIDED MINI PROGRAMS: Seven new checkpoints join five upgraded original programs.
  defineExample(
    "Guided Mini Programs", "Decisions checkpoint", "Guided Challenge", "Quiz Score Reporter",
    "Calculate a quiz result, assign a grade, and explain the learner's next step.",
    ["Conditions", "Before and After", "Coverage", "Variables"],
    `student = "Mina"
answers = [True, True, False, True, True]
correct = 0

for answer in answers:
    if answer:
        correct += 1

total_questions = len(answers)
percentage = correct / total_questions * 100

if percentage >= 80:
    grade = "Excellent"
elif percentage >= 60:
    grade = "Good progress"
else:
    grade = "Keep practising"

print("Student:", student)
print("Correct:", correct, "of", total_questions)
print("Percentage:", percentage)
print("Feedback:", grade)`,
    {
      checkpointAfter: "Decisions",
      prerequisites: ["Variables", "Lists", "Loops", "Conditions"],
    },
  ),
  defineExample(
    "Guided Mini Programs", "Loops checkpoint", "Guided Challenge", "Habit Streak Tracker",
    "Measure completed days, the current streak, and the longest streak in one report.",
    ["Loop Table", "Conditions", "Variables", "Structures"],
    `week = [True, True, False, True, True, True, False]
completed_days = 0
current_streak = 0
longest_streak = 0

for completed in week:
    if completed:
        completed_days += 1
        current_streak += 1
        if current_streak > longest_streak:
            longest_streak = current_streak
    else:
        current_streak = 0

completion_rate = completed_days / len(week) * 100

print("Completed days:", completed_days)
print("Longest streak:", longest_streak)
print("Completion rate:", round(completion_rate, 1))`,
    {
      checkpointAfter: "Loops",
      prerequisites: ["Lists", "For loops", "Conditions", "Running totals"],
    },
  ),
  defineExample(
    "Guided Mini Programs", "Functions checkpoint", "Guided Challenge", "Personal Expense Summary",
    "Use helper functions to summarize spending and compare it with a budget.",
    ["Function Journey", "Structures", "Loop Table", "Before and After"],
    `def category_totals(expenses):
    totals = {}
    for expense in expenses:
        category = expense["category"]
        amount = expense["amount"]
        totals[category] = totals.get(category, 0) + amount
    return totals

def largest_expense(expenses):
    return max(expenses, key=lambda expense: expense["amount"])

budget = 120
expenses = [
    {"category": "Food", "amount": 28},
    {"category": "Travel", "amount": 35},
    {"category": "Books", "amount": 22},
    {"category": "Food", "amount": 18},
]

totals = category_totals(expenses)
largest = largest_expense(expenses)
spent = sum(totals.values())
remaining = budget - spent

print("Category totals:", totals)
print("Largest expense:", largest)
print("Spent:", spent)
print("Remaining:", remaining)`,
    {
      checkpointAfter: "Functions and Scope",
      prerequisites: ["Functions", "Lists", "Dictionaries", "Loops"],
    },
  ),
  defineExample(
    "Guided Mini Programs", "Collections checkpoint", "Guided Challenge", "Classroom Attendance Report",
    "Compare registered and present students, then produce a complete attendance report.",
    ["Structures", "Loop Table", "Coverage", "Variables"],
    `registered = ["Ari", "Bea", "Chen", "Dina", "Eli"]
present = {"Ari", "Chen", "Eli"}
attendance_rows = []
absent = []

for student in registered:
    is_present = student in present
    attendance_rows.append({
        "name": student,
        "present": is_present,
    })
    if not is_present:
        absent.append(student)

present_count = len(present)
attendance_rate = present_count / len(registered) * 100

print("Attendance rows:")
for row in attendance_rows:
    label = "Present" if row["present"] else "Absent"
    print(row["name"], label)

print("Absent:", absent)
print("Attendance rate:", round(attendance_rate, 1))`,
    {
      checkpointAfter: "Collections",
      prerequisites: ["Lists", "Sets", "Dictionaries", "Loops", "Conditions"],
    },
  ),
  defineExample(
    "Guided Mini Programs", "Strings checkpoint", "Guided Challenge", "Word and Sentence Analyzer",
    "Clean a sentence, count its words, and identify the most frequent word.",
    ["Structures", "Loop Table", "Variables", "Before and After"],
    `sentence = "Python makes code clear, and Python makes learning visible."
cleaned = sentence.lower()

for mark in ",.!?":
    cleaned = cleaned.replace(mark, "")

words = cleaned.split()
frequencies = {}

for word in words:
    frequencies[word] = frequencies.get(word, 0) + 1

most_common = None
highest_count = 0

for word, count in frequencies.items():
    if count > highest_count:
        most_common = word
        highest_count = count

print("Words:", words)
print("Word count:", len(words))
print("Frequencies:", frequencies)
print("Most common:", most_common, highest_count)`,
    {
      checkpointAfter: "Collections",
      prerequisites: ["String methods", "Lists", "Dictionaries", "Loops"],
    },
  ),
  defineExample(
    "Guided Mini Programs", "References checkpoint", "Guided Challenge", "Library Loan Tracker",
    "Update a shared book collection safely and report the result of a loan request.",
    ["References", "Mutation Explorer", "Structures", "Conditions"],
    `def borrow_book(catalog, title, borrower):
    book = catalog.get(title)
    if book is None:
        return "Book not found"
    if not book["available"]:
        return "Book already borrowed"

    book["available"] = False
    book["borrower"] = borrower
    return "Loan recorded"

catalog = {
    "Python Basics": {"available": True, "borrower": None},
    "Learning Loops": {"available": False, "borrower": "Maya"},
}

message = borrow_book(catalog, "Python Basics", "Noor")

print(message)
for title, details in catalog.items():
    if details["available"]:
        status = "Available"
    else:
        status = "Borrowed by " + details["borrower"]
    print(title, status)`,
    {
      checkpointAfter: "References and Mutation",
      prerequisites: ["Functions", "Nested dictionaries", "Mutation", "Conditions"],
    },
  ),
  defineExample(
    "Guided Mini Programs", "OOP checkpoint", "Guided Challenge", "Object-Oriented Pet Care Tracker",
    "Create pet objects, update their care state through methods, and print a daily report.",
    ["Structures", "Function Journey", "References", "Mutation Explorer"],
    `class Pet:
    def __init__(self, name, animal):
        self.name = name
        self.animal = animal
        self.meals = 0
        self.exercised = False

    def feed(self):
        self.meals += 1

    def exercise(self):
        self.exercised = True

    def daily_status(self):
        exercise_text = "done" if self.exercised else "needed"
        return f"{self.name}: {self.meals} meals, exercise {exercise_text}"

pets = [Pet("Milo", "dog"), Pet("Luna", "cat")]

pets[0].feed()
pets[0].feed()
pets[0].exercise()
pets[1].feed()

print("Daily pet care report")
for pet in pets:
    print(pet.daily_status())`,
    {
      checkpointAfter: "Classes and Objects",
      prerequisites: ["Classes", "Constructors", "Methods", "Lists", "Loops"],
    },
  ),
]);

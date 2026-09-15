# A python function to determine the name and birthday of the user

name = input("What is your name?")
age = input("How old are you?")

#convert age from string to integer
age = int(age)

#calculate birth year
birth = (2026 - age)

#print users name and birth year
print(f"Hello {name} you were born in {birth}")

#print users age 10 years from now
future = (age + 10)
print(f"In 10 years you will be {future} years old")

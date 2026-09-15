# A python function to determine the name and birthday of the user

year = 2026
name = input("What is your name?")

#RULE --> Wrap the line that can fail, not the line before
#get users age while preventing false inputs
try:
   age = int(input("How old are you? "))
   if age <= 0:
      raise ValueError
except ValueError:
   print("Invalid age. Please enter a positive number.")
   exit()

#NO LONGER NECESSARY DUE TO try FUNCTION
#convert age from string to integer
#age = int(age)

#calculate birth year
birth = (year - age)

#print users name and birth year
print(f"Hello {name} you were born in {birth}")

#determine age range of the user
if age < 13:
   print("You are a child")
elif 13 <= age <= 19:
   print("You are a teen")
else:
   print("You are an adult")

#print users age 10 years from now
future = (age + 10)
print(f"In 10 years you will be {future} years old")

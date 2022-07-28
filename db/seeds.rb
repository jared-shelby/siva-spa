# Clear old seed data before re-seeding
jared = User.create(name: "Jared Shelby")

ski = Goal.create(name: "Ski Trip", amount: "2000", target: Time.now, image: "https://media.cntraveler.com/photos/5f84939a5f9755e5951db3f4/master/pass/WhitefishMountainResort-3.jpg", user: jared)

food_drink = Category.create(name: "Food/Drink")

starbucks = Transaction.create(amount: "4.56", date: Time.now, merchant: "Starbucks", user: jared, category: food_drink)

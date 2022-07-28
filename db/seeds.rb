# Clear old seed data before re-seeding
jared = User.create(name: "Jared Shelby")

ski = Goal.create(name: "Ski Trip", amount: 2000, target: Time.now, image: "https://media.cntraveler.com/photos/5f84939a5f9755e5951db3f4/master/pass/WhitefishMountainResort-3.jpg", user: jared)
home = Goal.create(name: "New House", amount: 40000, target: Time.now, image: "https://media.cntraveler.com/photos/5f84939a5f9755e5951db3f4/master/pass/WhitefishMountainResort-3.jpg", user: jared)

food_drink = Category.create(name: "Food/Drink")
entertainment = Category.create(name: "Entertainment")
bills = Category.create(name: "Bills")

starbucks = Transaction.create(amount: 4.56, date: Time.now, merchant: "Starbucks", user: jared, category: food_drink)
movies = Transaction.create(amount: 15.67, date: Time.now, merchant: "AMC Theaters", user: jared, category: entertainment)
electric = Transaction.create(amount: 180, date: Time.now, merchant: "ABC Electric", user: jared, category: bills)
phone = Transaction.create(amount: 50.60, date: Time.now, merchant: "Verizon", user: jared, category: bills)

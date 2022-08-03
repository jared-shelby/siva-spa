jared = User.create(name: "Jared Shelby", email: "jared.shelby@yale.edu")

Goal.create(name: "Ski Trip", amount: 2000, funded: 0, description: "Can't wait to go to the alps and have a great time!", target: Time.now, image: "https://media.cntraveler.com/photos/5f84939a5f9755e5951db3f4/master/pass/WhitefishMountainResort-3.jpg", user: jared)
Goal.create(name: "New House", amount: 40000, funded: 0, description: "Excited to work towards a down payment for our future forever home <3.", target: Time.now, image: "https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg", user: jared)

food_drink = Category.create(name: "Food/Drink")
entertainment = Category.create(name: "Entertainment")
bills = Category.create(name: "Bills")

Transaction.create(amount: 4.56, date: Time.now, merchant: "Coffee Bean", user: jared, category: food_drink)
Transaction.create(amount: 15.67, date: Time.now, merchant: "Theater Delight", user: jared, category: entertainment)
Transaction.create(amount: 180, date: Time.now, merchant: "Zap Electric", user: jared, category: bills)
Transaction.create(amount: 50.60, date: Time.now, merchant: "Mobile Madness", user: jared, category: bills)

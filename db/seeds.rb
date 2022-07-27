# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

jared = User.create(name: "Jared Shelby")

ski = Goal.create(name: "Ski Trip", amount: "2000", target: Time.now, image: "https://media.cntraveler.com/photos/5f84939a5f9755e5951db3f4/master/pass/WhitefishMountainResort-3.jpg", user: jared)

food_drink = Category.create(name: "Food/Drink")

starbucks = Transaction.create(amount: "4.56", date: Time.now, merchant: "Starbucks", user: jared, category: food_drink)

class User < ApplicationRecord
    has_many :goals
    has_many :transactions
    has_many :categories, through: :transactions
end

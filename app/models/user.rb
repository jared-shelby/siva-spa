class User < ApplicationRecord
    has_many :goals
    has_many :transactions
    has_many :categories, through: :transactions
    has_secure_password
end

class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :total_spent
  has_many :goals
  has_many :transactions

  def total_spent
    object.transactions.sum { |t| t.amount }
  end
end

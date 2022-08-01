class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :total_spent
  has_many :goals
  has_many :transactions

  def total_spent
    object.transactions.sum { |t| t.amount }
  end
end

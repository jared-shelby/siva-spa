class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :total_spent, :total_categories
  has_many :milestones
  has_many :transactions

  def total_spent
    Money.from_amount(object.transactions.sum { |t| t.amount }).format
  end

  def total_categories
    total_categories = {}
    Category.all.each {|category| total_categories[category.name] = 0}
    object.transactions.each do |transaction|
      total_categories[transaction.category.name] += transaction.amount
    end
    total_categories
  end

  def milestones
    object.milestones.order("target ASC")
  end

  def transactions
    object.transactions.order("date DESC")
  end
end

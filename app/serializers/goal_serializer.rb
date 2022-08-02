class GoalSerializer < ActiveModel::Serializer
  attributes :id, :name, :amount, :description, :target, :image
  belongs_to :user

  def amount
    Money.from_amount(object.amount).format
  end

  def target
    object.target.strftime("%B %d, %Y")
  end
end

class GoalSerializer < ActiveModel::Serializer
  attributes :id, :name, :amount, :amount_pretty, :funded, :description, :target, :image
  belongs_to :user

  def amount_pretty
    Money.from_amount(object.amount).format
  end

  def funded
    object.funded >= object.amount ? object.amount : object.funded
  end

  def target
    object.target.strftime("%B %d, %Y")
  end
end

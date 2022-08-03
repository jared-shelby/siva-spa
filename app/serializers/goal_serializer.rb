class GoalSerializer < ActiveModel::Serializer
  attributes :id, :name, :amount, :amount_pretty, :funded, :funded_pretty, :description, :target, :image, :completed?
  belongs_to :user

  def amount_pretty
    Money.from_amount(object.amount).format
  end

  def funded
    object.funded >= object.amount ? object.amount : object.funded
  end

  def funded_pretty
    Money.from_amount(object.funded).format
  end

  def target
    object.target.strftime("%B %d, %Y")
  end

  def completed?
    object.funded >= object.amount
  end
end

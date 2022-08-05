class CreateMilestones < ActiveRecord::Migration[7.0]
  def change
    create_table :milestones do |t|
      t.string :name
      t.decimal :amount
      t.decimal :funded
      t.string :description
      t.datetime :target
      t.string :image
      
      t.references :user
      t.timestamps
    end
  end
end

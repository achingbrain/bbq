include(bbq.domain.Repository);
include(bbq.domain.Entity);
include(bbq.util.BBQTestUtil);
include(bbq.ajax.MockAJAXRequest);
include(bbq.ajax.MockJSONResponse);

bbq.domain.MyEntity = new Class.create(bbq.domain.Entity, {
	_retrieveURL: "/MyEntity/get",

	_getDefaultObject: function() {
		return {
			id: null,
			foo: null,
			bar: null
		}
	}
});

test = new Test.Unit.Runner({

	testAdd: function() {
		with (this) {
			var holder = new bbq.domain.Repository({
				type: bbq.domain.MyEntity
			});

			this.assertEqual(0, holder.size());

			var entity = new bbq.domain.MyEntity({data: {id: "foo", foo: "baz", bar: "qux"}});
			holder.add(entity);

			// should have gone into the holder
			this.assertEqual(1, holder.size());

			// at index 0
			this.assertEqual(0, holder.indexOf(entity));

			bbq.ajax.MockAJAXRequest["/MyEntity/get"] = function(args) {
				return new bbq.ajax.MockJSONResponse({response: {id: args.id, foo: "baz", bar: "qux"}});
			};

			// pass identifier
			var entity2 = holder.add("bar");

			// should have turned it into domain object
			this.assertEqual(true, entity2 instanceof bbq.domain.MyEntity);

			// id field should have been set
			this.assertEqual("bar", entity2.getId());

			// pass data object
			var entity3 = holder.add({id: "baz", foo: "baz", bar: "qux"});

			// should have turned it into domain object
			this.assertEqual(true, entity3 instanceof bbq.domain.MyEntity);

			// id field should have been set
			this.assertEqual("baz", entity3.getId());

			// should now have three objects
			this.assertEqual(3, holder.size());
		}
	},

	testPut: function() {
		var holder = new bbq.domain.Repository({
			type: bbq.domain.MyEntity
		});

		var entity = holder.add({id: "foo", foo: "baz", bar: "qux"});

		this.assertEqual(entity, holder.get(0));

		var entity2 = holder.add({id: "bar", foo: "baz", bar: "qux"});

		this.assertEqual(entity2, holder.get(1));
	},

	testRemove: function() {
		var holder = new bbq.domain.Repository({
			type: bbq.domain.MyEntity
		});

		this.assertEqual(0, holder.size());

		var entity1 = holder.add({id: "foo", foo: "baz", bar: "qux"});

		// should have gone into the holder
		this.assertEqual(1, holder.size());

		var entity2 = holder.add({id: "bar", foo: "baz", bar: "qux"});

		// should have gone into the holder
		this.assertEqual(2, holder.size());

		// remove by domain object
		holder.remove(entity1);
		this.assertEqual(1, holder.size());

		// remove by id
		holder.remove(entity2.getId());
		this.assertEqual(0, holder.size());
	},

	testAddingSameObjectTwice: function() {
		var holder = new bbq.domain.Repository({
			type: bbq.domain.MyEntity
		});

		var entity1 = holder.add({id: "foo", foo: "baz", bar: "qux"});
		var entity2 = holder.add({id: "foo", foo: "baz", bar: "qux"});

		// should have gone into the holder
		this.assertEqual(1, holder.size());

		// make sure it's the same object
		this.assertEqual(true, entity1 instanceof bbq.domain.MyEntity, "instanceof did not work (1)");
		this.assertEqual(true, entity2 instanceof bbq.domain.MyEntity, "instanceof did not work (2)");
		this.assertEqual(entity1, entity2, "assertEqual did not work");
		this.assertEqual(true, entity1.equals(entity2), ".equals(other) did not work");
		this.assertEqual(true, entity1 == entity2, "== did not work");
		this.assertEqual(true, entity1 === entity2, "=== did not work");
	}
});

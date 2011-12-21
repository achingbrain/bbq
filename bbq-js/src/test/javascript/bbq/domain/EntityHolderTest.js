include(bbq.domain.EntityHolder);
include(bbq.domain.BBQEntity);
include(bbq.util.BBQTestUtil);
include(bbq.ajax.MockAJAXRequest);
include(bbq.ajax.MockJSONResponse);

bbq.domain.MyEntity = new Class.create(bbq.domain.BBQEntity, {
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

	testButtonClicked: function() {
		with (this) {
			Log.info("hello!!!");

			var holder = new bbq.domain.EntityHolder({
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
	}
});

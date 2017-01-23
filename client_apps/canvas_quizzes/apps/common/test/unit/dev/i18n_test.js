define((require) => {
  const I18n = require('i18n!something');
  describe('I18n.t', () => {
    it('should work with a simple string for a default value', () => {
      expect(I18n.t('Foo')).toEqual('Foo');
    });

    it('should work with a default object and an options object', () => {
      expect(I18n.t({ one: '1 person', other: '%{count} people' }, { count: 2 })).toBe('2 people');
    });

    it('should work with two params', () => {
      expect(I18n.t('foo', 'Foo')).toBe('Foo');
    });

    it('should interpolate options', () => {
      expect(I18n.t('foo', 'Hello %{some_var}', {
        some_var: 'World!'
      })).toBe('Hello World!');
    });

    it('should use .zero when count is 0', () => {
      expect(I18n.t('student_count', {
        zero: 'Nobody',
      }, { count: 0 })).toBe('Nobody');
    });

    it('should use .one when count is 1', () => {
      expect(I18n.t('student_count', {
        zero: 'Nobody',
        one: 'One student',
      }, { count: 1 })).toBe('One student');
    });

    it('should use .other when count is greater than 1', () => {
      expect(I18n.t('student_count', {
        zero: 'Nobody',
        one: 'One student',
        other: '%{count} students',
      }, { count: 3 })).toBe('3 students');
    });

    it('should just use the defaultValue', () => {
      expect(I18n.t('student_count', '%{count} students', {
        count: 3
      })).toBe('3 students');
    });
  });
});
